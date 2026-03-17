import random

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from institution.models import Institution, Program, Course, Announcement, Subject
from video.models import Video, VideoProgress, VideoNote, ChapterMarker
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
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

        # --- Seed ChapterMarkers for existing videos ---
        videos = Video.objects.all()
        instructors = get_user_model().objects.filter(groups__name=INSTRUCTOR_GROUP_NAME)
        chapter_labels = [
            'Introduction', 'Overview', 'Key Concepts', 'Deep Dive',
            'Demonstration', 'Summary', 'Q&A', 'Hands-On Activity',
        ]
        for video in videos:
            if not video.chapters.exists():
                duration = video.duration_seconds or 600
                num_chapters = random.randint(2, 3)
                for idx in range(num_chapters):
                    timestamp = int(duration * (idx + 1) / (num_chapters + 1))
                    ChapterMarker.objects.create(
                        video=video,
                        timestamp_seconds=timestamp,
                        label=random.choice(chapter_labels),
                        created_by=random.choice(instructors) if instructors.exists() else None,
                    )

        # --- Seed VideoProgress for students ---
        students = get_user_model().objects.filter(groups__name=STUDENT_GROUP_NAME)
        for student in students:
            student_courses = student.courses.all()
            for course in student_courses:
                course_videos = Video.objects.filter(courses=course)
                for video in course_videos:
                    if not VideoProgress.objects.filter(user=student, video=video, course=course).exists():
                        watched = random.choice([True, False])
                        progress = random.uniform(80, 100) if watched else random.uniform(5, 75)
                        VideoProgress.objects.create(
                            user=student,
                            video=video,
                            course=course,
                            watched=watched,
                            progress_percent=round(progress, 1),
                        )

        # --- Seed Quizzes with Questions and Choices ---
        quiz_data = [
            {
                'questions': [
                    {
                        'text': 'What is the primary purpose of VR in education?',
                        'choices': ['Entertainment only', 'Immersive experiential learning', 'Replacing teachers', 'Social media'],
                        'correct': 1,
                    },
                    {
                        'text': 'Which technology enables 360-degree video playback?',
                        'choices': ['CSS Grid', 'A-Frame / WebXR', 'jQuery', 'Bootstrap'],
                        'correct': 1,
                    },
                    {
                        'text': 'What percentage of video completion marks it as watched?',
                        'choices': ['50%', '60%', '80%', '100%'],
                        'correct': 2,
                    },
                ],
            },
        ]

        courses = Course.objects.all()
        for course in courses:
            if not Quiz.objects.filter(course=course).exists():
                creator = random.choice(instructors) if instructors.exists() else None
                quiz = Quiz.objects.create(
                    title=f'{course.name} Quiz',
                    course=course,
                    created_by=creator,
                )
                for q_idx, q_data in enumerate(quiz_data[0]['questions']):
                    question = Question.objects.create(
                        quiz=quiz,
                        text=q_data['text'],
                        order=q_idx,
                    )
                    for c_idx, c_text in enumerate(q_data['choices']):
                        Choice.objects.create(
                            question=question,
                            text=c_text,
                            is_correct=(c_idx == q_data['correct']),
                        )

        # --- Seed QuizAttempts for students ---
        quizzes = Quiz.objects.all()
        for student in students:
            student_courses = student.courses.all()
            for quiz in quizzes.filter(course__in=student_courses):
                if not QuizAttempt.objects.filter(user=student, quiz=quiz).exists():
                    questions = quiz.questions.all()
                    total = questions.count()
                    correct_count = random.randint(0, total)
                    score = round((correct_count / total) * 100, 1) if total > 0 else 0

                    attempt = QuizAttempt.objects.create(
                        user=student,
                        quiz=quiz,
                        score=score,
                    )

                    shuffled_questions = list(questions)
                    random.shuffle(shuffled_questions)
                    correct_questions = shuffled_questions[:correct_count]

                    for question in questions:
                        choices = list(question.choices.all())
                        if question in correct_questions:
                            selected = next((c for c in choices if c.is_correct), random.choice(choices))
                        else:
                            wrong_choices = [c for c in choices if not c.is_correct]
                            selected = random.choice(wrong_choices) if wrong_choices else random.choice(choices)

                        QuizAnswer.objects.create(
                            attempt=attempt,
                            question=question,
                            selected_choice=selected,
                        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database.'))
