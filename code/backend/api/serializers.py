from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import (
    Building,
    Course,
    Department,
    EmailOTP,
    Event,
    Faculty,
    Floor,
    Institution,
    Reminder,
    Room,
    Society,
    Student,
)


class UserPublicSerializer(serializers.ModelSerializer):
    """The `user` object shape returned alongside the auth token."""
    name = serializers.SerializerMethodField()
    institutionId = serializers.SerializerMethodField()
    rollNumber = serializers.SerializerMethodField()
    isVerified = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "name", "institutionId", "rollNumber", "isVerified", "role"]

    def get_name(self, obj):
        if hasattr(obj, "admin_profile") and obj.admin_profile:
            return obj.admin_profile.name
        if hasattr(obj, "student_profile") and obj.student_profile:
            return obj.student_profile.name
        return obj.get_full_name() or obj.username

    def get_institutionId(self, obj):
        if hasattr(obj, "admin_profile") and obj.admin_profile:
            return obj.admin_profile.institution_id
        if hasattr(obj, "student_profile") and obj.student_profile:
            return obj.student_profile.institution_id
        return None

    def get_rollNumber(self, obj):
        if hasattr(obj, "student_profile") and obj.student_profile:
            return obj.student_profile.roll_number
        return None

    def get_isVerified(self, obj):
        if hasattr(obj, "admin_profile") and obj.admin_profile:
            return True
        if hasattr(obj, "student_profile") and obj.student_profile:
            return obj.student_profile.is_verified
        return False

    def get_role(self, obj):
        if hasattr(obj, "admin_profile") or obj.is_staff or obj.is_superuser:
            return "admin"
        return "student"


class SendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=["register", "reset_password"])

    def validate_email(self, value):
        email = value.lower().strip()
        if not email.endswith("@thapar.edu"):
            raise serializers.ValidationError("Only institutional emails with the @thapar.edu domain are eligible.")
        return email

    def validate(self, attrs):
        email = attrs["email"]
        purpose = attrs["purpose"]
        exists = User.objects.filter(email__iexact=email).exists()
        if purpose == "register" and exists:
            raise serializers.ValidationError({"email": "An account with this institutional email already exists. Please sign in."})
        if purpose == "reset_password" and not exists:
            raise serializers.ValidationError({"email": "No account found with this email address."})
        return attrs


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    institution_id = serializers.IntegerField()
    otp = serializers.CharField(max_length=6, min_length=6)

    def validate_email(self, value):
        email = value.lower().strip()
        if not email.endswith("@thapar.edu"):
            raise serializers.ValidationError("Only emails with the @thapar.edu domain can be registered.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate_institution_id(self, value):
        if not Institution.objects.filter(id=value).exists():
            raise serializers.ValidationError("Institution not found.")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        return value.lower().strip()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class InstitutionSerializer(serializers.ModelSerializer):
    domain = serializers.CharField(source="email_domain", read_only=True)

    class Meta:
        model = Institution
        fields = ["id", "name", "email_domain", "domain", "address"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "department_name", "institution"]


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    # Aliases so the frontend can seamlessly read either code/name or course_code/course_name
    code = serializers.CharField(source="course_code", read_only=True)
    name = serializers.CharField(source="course_name", read_only=True)
    faculty = serializers.CharField(source="semester", read_only=True)
    syllabusLink = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "course_code", "course_name",
            "code", "name",
            "credits", "semester", "faculty",
            "syllabusLink",
            "department", "department_name",
        ]

    def get_syllabusLink(self, obj):
        return obj.syllabus_link or "https://www.thapar.edu/upload/files/BECSE_2024.pdf"


class FacultySerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    departmentCode = serializers.SerializerMethodField()

    class Meta:
        model = Faculty
        fields = [
            "id", "name", "designation", "email", "contact", "office",
            "department", "department_name", "departmentCode",
        ]

    def get_departmentCode(self, obj):
        name = obj.department.department_name if obj.department else ""
        code_map = {
            "Computer Science & Engineering": "CSED",
            "Electronics & Communication Engineering": "ECED",
            "Electrical & Instrumentation Engineering": "EIED",
            "Mechanical Engineering": "MED",
            "Civil Engineering": "CED",
            "Chemical Engineering": "CHED",
            "Biotechnology": "BTD",
        }
        return code_map.get(name, name)


class EventSerializer(serializers.ModelSerializer):
    # Aliases so the frontend can seamlessly read title, date, venue
    title = serializers.CharField(source="event_name", read_only=True)
    date = serializers.CharField(source="event_date", read_only=True)
    venue = serializers.CharField(source="location", read_only=True)
    description = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id", "event_name", "event_date", "location", "institution",
            "title", "date", "venue", "description",
        ]

    def get_description(self, obj):
        return f"Campus event at {obj.location or 'Auditorium'}."


class SocietySerializer(serializers.ModelSerializer):
    # Aliases so the frontend can seamlessly read name and events
    name = serializers.CharField(source="society_name", read_only=True)
    events = serializers.SerializerMethodField()

    class Meta:
        model = Society
        fields = [
            "id", "society_name", "description", "faculty_coordinator", "institution",
            "name", "events",
        ]

    def get_events(self, obj):
        return []


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            "id", "room_number", "room_name", "room_type",
            "x_coordinate", "y_coordinate", "z_coordinate",
        ]


class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = ["id", "floor_number", "rooms"]


class BuildingSerializer(serializers.ModelSerializer):
    """Matches the nested shape `map.js` expects for the campus map."""
    floors = FloorSerializer(many=True, read_only=True)

    class Meta:
        model = Building
        fields = ["id", "building_name", "institution", "floors"]


class ReminderSerializer(serializers.ModelSerializer):
    studentId = serializers.IntegerField(source="student_id", read_only=True)
    date = serializers.CharField(source="reminder_date", required=False, allow_blank=True, allow_null=True)
    note = serializers.CharField(source="description", required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Reminder
        fields = ["id", "studentId", "title", "reminder_date", "description", "date", "note"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request.user, "student_profile"):
            validated_data["student"] = request.user.student_profile
        return super().create(validated_data)


class ProfileUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=False)
    rollNumber = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    roll_number = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)


class QuerySerializer(serializers.Serializer):
    question = serializers.CharField()
