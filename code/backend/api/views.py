from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Building, Course, Event, Faculty, Institution, Reminder, Society, Student
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
    SocietySerializer,
    UserPublicSerializer,
)


class RegisterView(APIView):
    """POST /api/auth/register — matches auth.js's register() payload."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        with transaction.atomic():
            user = User.objects.create_user(
                username=data["email"],
                email=data["email"],
                password=data["password"],
            )
            Student.objects.create(
                user=user,
                institution_id=data["institution_id"],
                name=data["name"],
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserPublicSerializer(user).data},
            status=status.HTTP_201_CREATED,
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
