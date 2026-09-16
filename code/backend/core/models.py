from django.contrib.auth.models import User
from django.db import models


class Institution(models.Model):
    name = models.CharField(max_length=255)
    email_domain = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Student(models.Model):
    student_id = models.BigIntegerField(primary_key=True)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.DO_NOTHING,
        related_name="students",
        db_column="institution_id"
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    branch = models.CharField(max_length=255, blank=True, null=True)
    roll_number = models.CharField(max_length=50, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = "students"
        managed = False

    def __str__(self):
        return self.name


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="admins")
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Department(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="departments")
    department_name = models.CharField(max_length=255)

    def __str__(self):
        return self.department_name


class Course(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="courses")
    course_code = models.CharField(max_length=50)
    course_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course_code} — {self.course_name}"


class Building(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="buildings")
    building_name = models.CharField(max_length=255)

    def __str__(self):
        return self.building_name


class Floor(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name="floors")
    floor_number = models.IntegerField()

    def __str__(self):
        return f"{self.building.building_name} — Floor {self.floor_number}"


class Room(models.Model):
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=50)
    room_name = models.CharField(max_length=255, blank=True, null=True)
    room_type = models.CharField(max_length=100, blank=True, null=True)
    x_coordinate = models.FloatField(blank=True, null=True)
    y_coordinate = models.FloatField(blank=True, null=True)
    z_coordinate = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.room_name or self.room_number


class Event(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="events")
    event_name = models.CharField(max_length=255)
    event_date = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.event_name


class KnowledgeDocument(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="knowledge_documents")
    title = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Society(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name="societies")
    society_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    faculty_coordinator = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.society_name


class SocietyMember(models.Model):
    society = models.ForeignKey(Society, on_delete=models.CASCADE, related_name="members")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="society_memberships")
    role = models.CharField(max_length=100, default="Member")

    def __str__(self):
        return f"{self.student.name} @ {self.society.society_name}"


class Reminder(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="reminders")
    title = models.CharField(max_length=255)
    reminder_date = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
