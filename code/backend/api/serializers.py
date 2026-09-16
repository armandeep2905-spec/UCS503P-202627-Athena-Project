from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import (
    Building,
    Course,
    Department,
    Event,
    Floor,
    Institution,
    Reminder,
    Room,
    Society,
    Student,
)


class UserPublicSerializer(serializers.ModelSerializer):
    """The `user` object shape returned alongside the auth token."""
    name = serializers.CharField(source="student_profile.name")
    institutionId = serializers.IntegerField(source="student_profile.institution_id")
    rollNumber = serializers.CharField(source="student_profile.roll_number", allow_null=True)
    isVerified = serializers.BooleanField(source="student_profile.is_verified")

    class Meta:
        model = User
        fields = ["id", "email", "name", "institutionId", "rollNumber", "isVerified"]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    institution_id = serializers.IntegerField()

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_institution_id(self, value):
        if not Institution.objects.filter(id=value).exists():
            raise serializers.ValidationError("Institution not found.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "name", "email_domain", "address"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "department_name", "institution"]


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "course_code", "course_name", "department", "department_name"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "event_name", "event_date", "location", "institution"]


class SocietySerializer(serializers.ModelSerializer):
    class Meta:
        model = Society
        fields = ["id", "society_name", "description", "faculty_coordinator", "institution"]


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

    class Meta:
        model = Reminder
        fields = ["id", "studentId", "title", "reminder_date", "description"]

    def create(self, validated_data):
        validated_data["student"] = self.context["request"].user.student_profile
        return super().create(validated_data)


class QuerySerializer(serializers.Serializer):
    question = serializers.CharField()
