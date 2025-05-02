import random

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from institution.models import Institution, Program, Course, Announcement, Subject
from faker import Faker
from custom_auth.constants import ADMIN_GROUP_NAME, INSTRUCTOR_GROUP_NAME, STUDENT_GROUP_NAME


faker = Faker()


class Command(BaseCommand):
    help = 'Seed the database with test data'

    def handle(self, *args, **options):
        # Create a superuser
        email = 'admin@example.com'
        password = 'password'
        if not get_user_model().objects.filter(email=email).exists():
            get_user_model().objects.create_superuser(
                email=email, password=password, first_name=faker.first_name(), last_name=faker.last_name()
            )

        data = [
            {
                'institution_name': 'Drexel',
                'programs': [
                    {'name': 'Program 1', 'courses': ['Course 1', 'Course 2', 'Course 3']},
                    {'name': 'Program 2', 'courses': ['Course 1', 'Course 2', 'Course 3']},
                ]
            },
            {
                'institution_name': 'Temple',
                'programs': [
                    {'name': 'Program A', 'courses': ['Course X', 'Course Y', 'Course Z']},
                    {'name': 'Program B', 'courses': ['Course X', 'Course Y', 'Course Z']},
                ]
            },
        ]

        # Create institutions, programs, and courses
        for institution_data in data:
            institution = Institution.objects.get_or_create(name=institution_data['institution_name'])[0]

            for program_data in institution_data['programs']:
                program = Program.objects.get_or_create(institution=institution, name=program_data['name'])[0]

                for course_name in program_data['courses']:
                    course = Course.objects.get_or_create(program=program, name=course_name)[0]

                    # Create three subjects for each course
                    for j in range(3):
                        subject_name = f"Subject {j + 1}"
                        subject_description = faker.sentence()
                        Subject.objects.create(course=course, name=subject_name, description=subject_description)

                    for i in range(3):
                        Announcement.objects.create(
                            course=course,
                            title=f"Announcement {i + 1}",
                            body="This is the body of the announcement.",
                        )

        # Create users and randomly assign to an institution and program
        roles_data = [
            {'role': STUDENT_GROUP_NAME, 'count': 5},
            {'role': INSTRUCTOR_GROUP_NAME, 'count': 3},
            {'role': ADMIN_GROUP_NAME, 'count': 2},
        ]
        institutions = Institution.objects.all()
        for role_data in roles_data:
            group, _ = Group.objects.get_or_create(name=role_data['role'])

            for i in range(role_data['count']):
                email = f'{role_data["role"]}{i + 1}@example.com'
                user = get_user_model().objects.create_user(
                    email=email, password=password, first_name=faker.first_name(), last_name=faker.last_name()
                )
                user.groups.add(group)
                user.institution = random.choice(institutions)
                institution_programs = Program.objects.filter(institution=user.institution)
                program = random.choice(institution_programs)
                user.programs.add(program)
                courses = Course.objects.filter(program=program)
                for course in courses:
                    user.courses.add(course)
                user.save()

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))
