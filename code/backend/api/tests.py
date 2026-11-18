from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from core.models import Department, Event, Faculty, Institution, Society, Student
from api.serializers import (
    EventSerializer,
    FacultySerializer,
    InstitutionSerializer,
    RegisterSerializer,
    SocietySerializer,
)


class AuthDomainTestCase(TestCase):
    """Test suite for authentication and strict @thapar.edu domain enforcement."""

    def setUp(self):
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Thapar Institute of Engineering and Technology",
            email_domain="thapar.edu",
            address="Patiala, Punjab",
        )

    def test_thapar_email_registration_success(self):
        """TC_AUTH_01: Valid @thapar.edu email should successfully register."""
        payload = {
            "name": "Sanchit Narula",
            "email": "snarula@thapar.edu",
            "password": "Password123!",
            "institution_id": self.institution.id,
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["email"], "snarula@thapar.edu")

    def test_non_thapar_email_registration_blocked(self):
        """TC_AUTH_02: Non-thapar email (@gmail.com) must be rejected with validation error."""
        payload = {
            "name": "External User",
            "email": "user@gmail.com",
            "password": "Password123!",
            "institution_id": self.institution.id,
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Only emails with the @thapar.edu domain", str(response.data))

    def test_duplicate_email_registration_blocked(self):
        """TC_AUTH_03: Duplicate email registration must be rejected."""
        User.objects.create_user(
            username="existing@thapar.edu",
            email="existing@thapar.edu",
            password="Password123!",
        )
        payload = {
            "name": "Duplicate User",
            "email": "existing@thapar.edu",
            "password": "Password123!",
            "institution_id": self.institution.id,
        }
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SerializerFieldAliasesTestCase(TestCase):
    """Test suite for backend database field normalization and aliases."""

    def setUp(self):
        self.institution = Institution.objects.create(
            name="Thapar Institute of Engineering and Technology",
            email_domain="thapar.edu",
        )
        self.department = Department.objects.create(
            institution=self.institution,
            department_name="Computer Science & Engineering",
        )

    def test_institution_serializer_domain_alias(self):
        """TC_SERIALIZER_01: Serializer should provide 'domain' alias for 'email_domain'."""
        serializer = InstitutionSerializer(self.institution)
        self.assertEqual(serializer.data["domain"], "thapar.edu")
        self.assertEqual(serializer.data["email_domain"], "thapar.edu")

    def test_event_serializer_aliases(self):
        """TC_SERIALIZER_02: EventSerializer should provide title, date, and venue aliases."""
        event = Event.objects.create(
            institution=self.institution,
            event_name="HackTU 6.0",
            event_date="2026-10-10",
            location="Main Auditorium",
        )
        serializer = EventSerializer(event)
        self.assertEqual(serializer.data["title"], "HackTU 6.0")
        self.assertEqual(serializer.data["date"], "2026-10-10")
        self.assertEqual(serializer.data["venue"], "Main Auditorium")

    def test_society_serializer_aliases(self):
        """TC_SERIALIZER_03: SocietySerializer should provide 'name' alias for 'society_name'."""
        society = Society.objects.create(
            institution=self.institution,
            society_name="Creative Computing Society",
            description="Technical society at Thapar.",
        )
        serializer = SocietySerializer(society)
        self.assertEqual(serializer.data["name"], "Creative Computing Society")
        self.assertIn("events", serializer.data)

    def test_faculty_serializer_department_code(self):
        """TC_SERIALIZER_04: FacultySerializer should correctly map departmentCode."""
        faculty = Faculty.objects.create(
            department=self.department,
            name="Dr. Sample Faculty",
            designation="Associate Professor",
            email="sample@thapar.edu",
            office="LP-101",
        )
        serializer = FacultySerializer(faculty)
        self.assertEqual(serializer.data["departmentCode"], "CSED")
        self.assertEqual(serializer.data["email"], "sample@thapar.edu")


class EndpointsTestCase(TestCase):
    """Test suite for public GET endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Thapar Institute of Engineering and Technology",
            email_domain="thapar.edu",
        )

    def test_institutions_list_endpoint(self):
        """TC_API_01: GET /api/institutions/ returns HTTP 200."""
        response = self.client.get("/api/institutions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_faculty_list_endpoint(self):
        """TC_API_02: GET /api/faculty/ returns HTTP 200."""
        response = self.client.get("/api/faculty/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_societies_list_endpoint(self):
        """TC_API_03: GET /api/societies/ returns HTTP 200."""
        response = self.client.get("/api/societies/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_events_list_endpoint(self):
        """TC_API_04: GET /api/events/ returns HTTP 200."""
        response = self.client.get("/api/events/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
