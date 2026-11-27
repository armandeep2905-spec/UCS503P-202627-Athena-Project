import datetime
import logging
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Building, Course, EmailOTP, Event, Faculty, Institution, Reminder, Society, Student
from core.rag_service import get_rag_service

from .serializers import (
    BuildingSerializer,
    CourseSerializer,
    EventSerializer,
    FacultySerializer,
    InstitutionSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    QuerySerializer,
    RegisterSerializer,
    ReminderSerializer,
    ResetPasswordSerializer,
    SendOtpSerializer,
    SocietySerializer,
    UserPublicSerializer,
)

logger = logging.getLogger(__name__)


def send_otp_email(to_email, otp, purpose):
    """Deliver a professional HTML + plain-text OTP email to the student."""
    purpose_label = "Student Registration" if purpose == "register" else "Password Reset"
    subject = f"Athena TIET — Your Verification Code: {otp}"
    plain_text = (
        f"Hello,\n\n"
        f"Your verification code for {purpose_label} on the Athena TIET Campus Platform is:\n\n"
        f"   {otp}\n\n"
        f"This code will expire in 10 minutes. If you did not request this, please ignore this email.\n\n"
        f"Best regards,\n"
        f"Athena Campus Intelligence Portal\n"
        f"Thapar Institute of Engineering & Technology, Patiala"
    )
    html_message = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <div style="margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;">
        <span style="font-size: 11px; font-family: monospace; color: #991b1b; background-color: #fef2f2; padding: 4px 8px; border-radius: 4px; font-weight: 600;">ATHENA TIET SECURITY</span>
        <h2 style="margin: 8px 0 0 0; color: #111827; font-size: 20px; font-weight: 600;">{purpose_label} Code</h2>
      </div>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
        Use the following one-time code to verify your institutional account at <strong>Thapar Institute of Engineering &amp; Technology</strong>:
      </p>
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #991b1b;">{otp}</span>
      </div>
      <p style="color: #6b7280; font-size: 12px; line-height: 1.4; margin: 0 0 16px 0;">
        This code is valid for <strong>10 minutes</strong>. Never share this code with anyone.
      </p>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 14px; color: #9ca3af; font-size: 11px;">
        Athena Campus Intelligence Platform &bull; Thapar Institute of Engineering &amp; Technology, Patiala
      </div>
    </div>
    """
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "Athena TIET <noreply@thapar.edu>")
    return send_mail(
        subject=subject,
        message=plain_text,
        from_email=from_email,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=False,
    )


class SendOtpView(APIView):
    """
    POST /api/auth/send-otp/
    Generates a 6-digit OTP, stores it in EmailOTP with 10-minute validity, and sends email.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower().strip()
        purpose = serializer.validated_data["purpose"]

        # Generate 6-digit numerical code
        otp = f"{secrets.randbelow(900000) + 100000}"
        expires_at = timezone.now() + timedelta(minutes=10)

        # Invalidate previous unverified OTPs for this email & purpose
        EmailOTP.objects.filter(email=email, purpose=purpose, is_used=False).update(is_used=True)

        EmailOTP.objects.create(
            email=email,
            otp=otp,
            purpose=purpose,
            expires_at=expires_at,
        )

        email_sent = False
        try:
            send_otp_email(email, otp, purpose)
            email_sent = True
        except Exception as e:
            logger.warning(f"[SendOtpView] Failed to deliver email to {email}: {e}")

        resp_payload = {
            "message": f"Verification code sent to {email}.",
            "email_sent": email_sent,
        }

        # In DEBUG or console backend mode, provide dev_otp for developer ease
        if getattr(settings, "DEBUG", False) or "console" in getattr(settings, "EMAIL_BACKEND", ""):
            resp_payload["dev_otp"] = otp

        return Response(resp_payload, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    POST /api/auth/register
    Creates a new Student user profile strictly after verifying the email OTP.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data["email"].lower().strip()
        otp = data["otp"].strip()

        # Validate OTP
        otp_record = (
            EmailOTP.objects.filter(email=email, purpose="register", is_used=False)
            .order_by("-id")
            .first()
        )

        if not otp_record or not otp_record.is_valid() or otp_record.otp != otp:
            if otp_record:
                otp_record.attempts += 1
                otp_record.save(update_fields=["attempts"])
            return Response(
                {"detail": "Invalid or expired verification code. Please request a new code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark OTP as consumed
        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=data["password"],
            )
            Student.objects.create(
                user=user,
                institution_id=data["institution_id"],
                name=data["name"],
                is_verified=True,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserPublicSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class ResetPasswordView(APIView):
    """
    POST /api/auth/reset-password/
    Verifies OTP sent to @thapar.edu email and resets the user's password.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data["email"].lower().strip()
        otp = data["otp"].strip()
        new_password = data["new_password"]

        otp_record = (
            EmailOTP.objects.filter(email=email, purpose="reset_password", is_used=False)
            .order_by("-id")
            .first()
        )

        if not otp_record or not otp_record.is_valid() or otp_record.otp != otp:
            if otp_record:
                otp_record.attempts += 1
                otp_record.save(update_fields=["attempts"])
            return Response(
                {"detail": "Invalid or expired password reset code. Please request a new code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "No account found with this email."},
                status=status.HTTP_404_NOT_FOUND,
            )

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password reset successfully. You can now sign in with your new password."},
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):
    """POST /api/auth/login — matches auth.js's login(email, password)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=user_obj.username, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserPublicSerializer(user).data})


class InstitutionViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces institutions.js mock — GET /api/institutions/, GET /api/institutions/{id}/"""
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [permissions.AllowAny]


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces courses.js mock — GET /api/courses/"""
    queryset = Course.objects.select_related("department").all().order_by("id")
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class FacultyViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces faculty.js mock — GET /api/faculty/"""
    queryset = Faculty.objects.select_related("department").all().order_by("id")
    serializer_class = FacultySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces events.js mock — GET /api/events/"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]


class SocietyViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces societies.js mock — GET /api/societies/"""
    queryset = Society.objects.all()
    serializer_class = SocietySerializer
    permission_classes = [permissions.AllowAny]


class BuildingViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces map.js mock — GET /api/map/locations/, GET /api/map/locations/{id}/"""
    queryset = Building.objects.prefetch_related("floors__rooms").all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.AllowAny]


def _get_or_create_student_profile(user):
    """
    Ensure every authenticated user (including staff/admin accounts) has a valid
    Student profile attached so reminders and academic tracking work seamlessly.
    """
    if hasattr(user, "student_profile") and user.student_profile:
        return user.student_profile
    institution = None
    if hasattr(user, "admin_profile") and user.admin_profile:
        institution = user.admin_profile.institution
    if not institution:
        institution = Institution.objects.first()
    student, _ = Student.objects.get_or_create(
        user=user,
        defaults={
            "institution": institution,
            "name": (
                user.admin_profile.name
                if hasattr(user, "admin_profile") and user.admin_profile
                else user.get_full_name() or user.username
            ),
            "is_verified": True,
        },
    )
    return student


class ReminderViewSet(viewsets.ModelViewSet):
    """
    CRUD /api/reminders/ — scoped strictly to the logged-in student account.
    Supports GET (list), POST (create), GET {id}, PATCH/PUT {id}, DELETE {id}.
    """
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Reminder.objects.none()
        student = _get_or_create_student_profile(user)

        # Seed initial starter reminders if this student account has none yet
        if not Reminder.objects.filter(student=student).exists():
            starter_reminders = [
                {
                    "title": "Software Engineering Assignment Due",
                    "reminder_date": "2026-09-12",
                    "description": "Submit UCS503 project report on GitHub. Include all team member journals.",
                },
                {
                    "title": "Mid-Semester Examinations",
                    "reminder_date": "2026-09-25",
                    "description": "Mid-semester exams begin. Check date sheet for subject-wise schedule.",
                },
                {
                    "title": "Hackathon Registration Deadline",
                    "reminder_date": "2026-09-18",
                    "description": "Register your team for Build for Good hackathon before the deadline.",
                },
                {
                    "title": "Library Book Return",
                    "reminder_date": "2026-09-14",
                    "description": "Return 'Design Patterns' by Gamma et al. to the central library.",
                },
            ]
            for sr in starter_reminders:
                Reminder.objects.create(student=student, **sr)

        return Reminder.objects.filter(student=student).order_by("-id")

    def perform_create(self, serializer):
        student = _get_or_create_student_profile(self.request.user)
        serializer.save(student=student)


class ProfileView(APIView):
    """
    GET /api/auth/me/ — retrieves current authenticated user profile.
    PATCH /api/auth/me/ — updates student name and roll number.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserPublicSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        student = _get_or_create_student_profile(user)
        if "name" in data and data["name"]:
            clean_name = data["name"].strip()
            student.name = clean_name
            user.first_name = clean_name
            user.save(update_fields=["first_name"])
            if hasattr(user, "admin_profile") and user.admin_profile:
                user.admin_profile.name = clean_name
                user.admin_profile.save(update_fields=["name"])
        roll = data.get("rollNumber") or data.get("roll_number")
        if roll is not None:
            student.roll_number = str(roll).strip()
        student.save()
        return Response(UserPublicSerializer(user).data)


class QueryView(APIView):
    """
    POST /api/query/ — live RAG pipeline grounded on official TIET documents,
    retrieving from FTS5 SQLite index and answering via Google Gemini API.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data["question"]

        try:
            rag_service = get_rag_service()
            response_data = rag_service.answer_query(question)
        except Exception as e:
            print(f"[QueryView] Error answering query: {e}")
            response_data = {
                "answer": "I could not retrieve an answer right now. Please consult the Thapar academic regulations or contact the Dean of Academic Affairs (DoAA).",
                "sources": [],
                "locationId": None,
            }

        return Response(response_data, status=status.HTTP_200_OK)
