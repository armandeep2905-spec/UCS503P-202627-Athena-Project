from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"institutions", views.InstitutionViewSet, basename="institution")
router.register(r"courses", views.CourseViewSet, basename="course")
router.register(r"faculty", views.FacultyViewSet, basename="faculty")
router.register(r"events", views.EventViewSet, basename="event")
router.register(r"societies", views.SocietyViewSet, basename="society")
router.register(r"map/locations", views.BuildingViewSet, basename="building")

urlpatterns = [
    re_path(r"^auth/register/?$", views.RegisterView.as_view(), name="auth-register"),
    re_path(r"^auth/login/?$", views.LoginView.as_view(), name="auth-login"),
    re_path(r"^reminders/?$", views.ReminderListCreateView.as_view(), name="reminders"),
    re_path(r"^query/?$", views.QueryView.as_view(), name="query"),
] + router.urls
