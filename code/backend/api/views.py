from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Building, Course, Event, Institution, Reminder, Society, Student

from .serializers import (
    BuildingSerializer,
    CourseSerializer,
    EventSerializer,
    InstitutionSerializer,
    LoginSerializer,
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
    queryset = Course.objects.select_related("department").all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces events.js mock — GET /api/events/"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class SocietyViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces societies.js mock — GET /api/societies/"""
    queryset = Society.objects.all()
    serializer_class = SocietySerializer
    permission_classes = [permissions.IsAuthenticated]


class BuildingViewSet(viewsets.ReadOnlyModelViewSet):
    """Replaces map.js mock — GET /api/map/locations/, GET /api/map/locations/{id}/"""
    queryset = Building.objects.prefetch_related("floors__rooms").all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReminderListCreateView(generics.ListCreateAPIView):
    """Replaces reminders.js mock — GET/POST /api/reminders/, scoped to the logged-in student."""
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(student=self.request.user.student_profile)


class QueryView(APIView):
    """
    POST /api/query/ — placeholder for the real RAG pipeline (embeddings +
    vector retrieval + LLM). Currently returns a canned response so the
    frontend can integrate against a real endpoint shape before the RAG
    pipeline is built.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data["question"]

        return Response(
            {
                "answer": f"(placeholder) RAG pipeline not wired up yet. You asked: \"{question}\"",
                "sources": [],
                "locationId": None,
            }
        )
