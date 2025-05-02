from django.apps import AppConfig


class InstitutionConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "institution"

class ProgramConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "program"
class CoursesConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "Courses"
class SubjectsConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "Subjects"
