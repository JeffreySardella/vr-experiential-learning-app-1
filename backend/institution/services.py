from datetime import datetime
from typing import List

from custom_auth.models import User

from .models import Announcement, Course, Institution, Program, Subject


def retrieve_all_institution() -> List[Institution]:
    return Institution.objects.all()


def retrieve_institution(id: int) -> Institution:
    return Institution.objects.get(id=id)


def create_institution(*, name: str) -> Institution:
    obj = Institution(name=name, datetime_created=datetime.utcnow())
    obj.full_clean()
    obj.save()
    return obj


def create_program(*, institution_id: int, name: str) -> Program:
    obj = Program(institution_id=institution_id, name=name)
    obj.full_clean()
    obj.save()
    return obj


def retrieve_all_programs() -> List[Program]:
    return Program.objects.all()


def retrieve_programs_in_institution(institution_id: int) -> List[Program]:
    return Program.objects.filter(institution_id=institution_id)


def retrieve_program(id: int) -> Program:
    return Program.objects.get(id=id)


def retrieve_programs_by_id(ids: List[int]) -> List[Program]:
    return Program.objects.filter(id__in=ids).all()


def create_course(*, program_id: int, name: str) -> Course:
    obj = Course(program_id=program_id, name=name)
    obj.full_clean()
    obj.save()
    return obj


def retrieve_all_courses() -> List[Course]:
    return Course.objects.all()


def retrieve_courses(program_id: int) -> List[Course]:
    return Course.objects.filter(program_id=program_id)


def retrieve_course(id: int) -> Course:
    return Course.objects.get(id=id)


def delete_course(id: int):
    try:
        course = Course.objects.get(id=id)
        course.delete()
    except Course.DoesNotExist:
        raise Exception("Course does not exist")


def retrieve_announcements_for_course(course_id: int) -> List[Announcement]:
    return Announcement.objects.filter(course_id=course_id).order_by('-datetime_created')


def retrieve_announcement(announcement_id: int) -> Announcement:
    return Announcement.objects.filter(id=announcement_id).first()


def update_announcement(announcement_id: int, *, title: str, body: str) -> Announcement:
    announcement = retrieve_announcement(announcement_id)
    announcement.title = title
    announcement.body = body
    announcement.full_clean()
    announcement.save()
    return announcement


def create_announcement(*, course_id: int, title: str, body: str) -> Announcement:
    obj = Announcement(course_id=course_id, title=title, body=body, datetime_created=datetime.utcnow())
    obj.full_clean()
    obj.save()
    return obj


def create_subject(*, course_id: int, name: str) -> Subject:
    obj = Subject(course_id=course_id, name=name, description = "")
    obj.full_clean()
    obj.save()
    return obj


def retrieve_all_subject() -> List[Subject]:
    return Subject.objects.all()


def retrieve_subjects(course_id: int) -> List[Subject]:
    return Subject.objects.filter(course_id=course_id)


def retrieve_subject(id: int) -> Subject:
    return Subject.objects.get(id= id)


def delete_subject(id: int):
    try:
        subject = Subject.objects.get(id=id)
        subject.delete()
    except Subject.DoesNotExist:
        raise Exception("Subject does not exist")


def update_subject_name(id: int, new_name: str) -> Subject:
    try:
        subject = Subject.objects.get(id=id)
        subject.name = new_name
        subject.full_clean()
        subject.save()
        return subject
    except Subject.DoesNotExist:
        raise Exception("Subject does not exist")


# user add a course
def add_course(user: User, course_name: str, course_password :str ) -> bool:
    courses =  list (Course.objects.filter(name =course_name , password = course_password) )
    if courses:
        course = courses[0]
        user.courses.add(course)
        user.save()
        return True
    else:
        return False


# wether user added a course or not
def added_course(user: User, course_id: int) -> bool:
    try:
        course = Course.objects.get(id=course_id)
        if course:
            if course in user.courses.all():
                return True
    except:
        return False

    return False