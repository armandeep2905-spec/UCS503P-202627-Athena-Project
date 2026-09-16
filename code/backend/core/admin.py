from django.contrib import admin

from .models import (
    Admin,
    Building,
    Course,
    Department,
    Event,
    Floor,
    Institution,
    KnowledgeDocument,
    Reminder,
    Room,
    Society,
    SocietyMember,
    Student,
)

admin.site.register(Institution)
admin.site.register(Student)
admin.site.register(Admin)
admin.site.register(Department)
admin.site.register(Course)
admin.site.register(Building)
admin.site.register(Floor)
admin.site.register(Room)
admin.site.register(Event)
admin.site.register(KnowledgeDocument)
admin.site.register(Society)
admin.site.register(SocietyMember)
admin.site.register(Reminder)
