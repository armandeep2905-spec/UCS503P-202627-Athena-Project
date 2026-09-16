from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"institutions", views.InstitutionViewSet, basename="institution")
router.register(r"courses", views.CourseViewSet, basename="course")
router.register(r"events", views.EventViewSet, basename="event")
router.register(r"societies", views.SocietyViewSet, basename="society")
router.register(r"map/locations", views.BuildingViewSet, basename="building")

urlpatterns = [
    path("auth/register", views.RegisterView.as_view(), name="auth-register"),
    path("auth/login", views.LoginView.as_view(), name="auth-login"),
    path("reminders", views.ReminderListCreateView.as_view(), name="reminders"),
    path("query", views.QueryView.as_view(), name="query"),
] + router.urls
