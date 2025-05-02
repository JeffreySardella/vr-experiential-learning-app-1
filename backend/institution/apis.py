import json
from typing import List

from django.core.exceptions import ValidationError
from django.http import HttpResponseNotFound
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from . import services
from .models import Course
from .models import Program
from .models import Subject
from .serializers import AddCourseSerializer
from .serializers import AnnouncementApiGetSchema
from .serializers import AnnouncementPostSchema
from .serializers import AnnouncementPutSchema
from .serializers import InstitutionApiGetSchema
from .serializers import InstitutionApiPostSchema
from .services import create_subject
from .serializers import ProgramApiGetSchema
from .serializers import ProgramApiPostSchema
from .serializers import CourseApiGetSchema
from .serializers import CourseApiPostSchema
from .serializers import SubjectApiGetSchema
from .serializers import SubjectApiPostSchema
from .serializers import SubjectApiEditSchema
from backend.decorators import method_permission_classes


class InstitutionApi(APIView):
    @swagger_auto_schema(
        responses={
            200: InstitutionApiGetSchema(many=True)
        }
    )
    def get(self, request):
        institutions = services.retrieve_all_institution()
        serializer = InstitutionApiGetSchema(institutions, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=InstitutionApiPostSchema,
        responses={
            201: InstitutionApiGetSchema()
        }
    )
    @method_permission_classes([IsAdminUser])
    def post(self, request):
        serializer = InstitutionApiPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                institution = services.create_institution(**serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = InstitutionApiGetSchema(institution)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstitutionByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: InstitutionApiGetSchema()
        }
    )
    def get(self, request, id):
        person = services.retrieve_institution(id)
        serializer = InstitutionApiGetSchema(person)
        data = serializer.data
        return Response(data)


class ProgramApi(APIView):
    @swagger_auto_schema(
        responses={
            200: ProgramApiGetSchema(many=True)
        }
    )
    def get(self, request, institution_id): 
        programs = services.retrieve_programs_in_institution(institution_id)
        serializer = ProgramApiGetSchema(programs, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=ProgramApiPostSchema,
        responses={
            201: ProgramApiGetSchema()
        }
    )
    def post(self, request, institution_id): 
        serializer = ProgramApiPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                program = services.create_program(institution_id=institution_id, **serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = ProgramApiGetSchema(program)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProgramByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: ProgramApiGetSchema()
        }
    )
    def get(self, request, institution_id, id):
        program = services.retrieve_program(id)
        serializer = ProgramApiGetSchema(program)
        data = serializer.data
        return Response(data)


class CourseApi(APIView):
    @swagger_auto_schema(
        responses={
            200: CourseApiGetSchema(many=True)
        }
    )
    def get(self, request, institution_id, program_id):
        courses = services.retrieve_courses(program_id)
        serializer = CourseApiGetSchema(courses, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=CourseApiPostSchema,
        responses={
            201: CourseApiGetSchema()
        }
    )
    def post(self, request, institution_id, program_id):
        serializer = CourseApiPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                course = services.create_course(program_id=program_id, **serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = CourseApiGetSchema(course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CourseByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: CourseApiGetSchema()
        }
    )
    def get(self, request, institution_id, program_id, id):
        course = services.retrieve_course(id)
        serializer = CourseApiGetSchema(course)
        data = serializer.data
        return Response(data)
    
    @swagger_auto_schema(
        responses={
            204: "No Content"
        }
    )
    def delete(self, request, institution_id, program_id, id):
        try:
            services.delete_course(id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return HttpResponseNotFound()


class SubjectsByCourseAPI(APIView):
    @swagger_auto_schema(
        responses={
            200: SubjectApiGetSchema(many=True)
        }
    )
    def get(self, request, institution_id, program_id, course_id):
        subjects = services.retrieve_subjects(course_id)
        serializer = SubjectApiGetSchema(subjects, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=SubjectApiPostSchema,
        responses={
            201: SubjectApiGetSchema()
        }
    )
    def post(self, request, institution_id, program_id, course_id):
        serializer = SubjectApiPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                subject = create_subject(course_id=course_id, **serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer= SubjectApiGetSchema(subject)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubjectByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: SubjectApiGetSchema()
        }
    )
    def get(self, request ,institution_id , program_id ,course_id, id):
        person = services.retrieve_subject(id)
        serializer = SubjectApiGetSchema(person)
        data = serializer.data
        return Response(data)

    @swagger_auto_schema(
        responses={
            204: "Subject deleted successfully",
            404: "Subject not found in the specified course"
        }
    )
    def delete(self, request ,institution_id , program_id ,course_id, id):
        try:
            subject = services.retrieve_subject(id)
            if subject.course_id != course_id:
                return Response("Subject not found in the specified course", status=status.HTTP_404_NOT_FOUND)
            subject.delete()
            return Response("Subject deleted successfully", status=status.HTTP_204_NO_CONTENT)
        except Subject.DoesNotExist:
            return Response("Subject not found", status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=SubjectApiEditSchema,
        responses={200: SubjectApiGetSchema()}
    )
    def patch(self, request, institution_id, program_id, course_id, id):
        try:
            subject = services.retrieve_subject(id)
        except Subject.DoesNotExist:
            return Response("Subject not found", status=status.HTTP_404_NOT_FOUND)
    
        # Check if the subject belongs to the specified course
        if subject.course_id != course_id:
            return Response("Subject not found in the specified course", status=status.HTTP_404_NOT_FOUND)

        try:
                serializer = SubjectApiEditSchema(instance=subject, data=request.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnouncementApi(APIView):
    @swagger_auto_schema(
        responses={
            200: AnnouncementApiGetSchema(many=True)
        }
    )
    def get(self, request, course_id):
        announcements = services.retrieve_announcements_for_course(course_id)
        serializer = AnnouncementApiGetSchema(announcements, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=AnnouncementPostSchema,
        responses={
            201: AnnouncementApiGetSchema()
        }
    )
    def post(self, request, course_id):
        serializer = AnnouncementPostSchema(data=request.data)
        if serializer.is_valid():
            try:
                announcement = services.create_announcement(course_id=course_id, **serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = AnnouncementApiGetSchema(announcement)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnouncementByIdApi(APIView):
    @swagger_auto_schema(
        responses={
            200: AnnouncementApiGetSchema(many=False)
        }
    )
    def get(self, request, course_id, announcement_id):
        announcement = services.retrieve_announcement(announcement_id)
        serializer = AnnouncementApiGetSchema(announcement)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=AnnouncementPutSchema,
        responses={
            204: "No Content"
        }
    )
    def put(self, request, course_id, announcement_id):
        serializer = AnnouncementPutSchema(data=request.data)
        if serializer.is_valid():
            try:
                announcement = services.update_announcement(announcement_id, **serializer.data)
            except ValidationError as e:
                return Response(e, status=status.HTTP_400_BAD_REQUEST)
            serializer = AnnouncementApiGetSchema(announcement)
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddCourseApi(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddCourseSerializer

    # @swagger_auto_schema(responses={200: CourseApiGetSchema()})
    def get(self, request):
        try:
            course_id = int(request.GET.get("course_id"))
            result = services.added_course(request.user, course_id)
            return Response(result)
        except Exception as e:
            print(e)
            return Response(False)

    # @swagger_auto_schema(responses={200: CourseApiGetSchema()})
    def post(self, request):
        data = json.loads(request.body)
        course_name = data.get("course_name")
        course_password = data.get("course_password")
        result = services.add_course(request.user, course_name, course_password)
        print("AddCourseApi", result)
        # serializer = CourseApiGetSchema(course)
        # data = serializer.data
        # return Response(course)
        return Response(result)


class UserCoursesApi(GenericAPIView):
    permission_classes = [IsAuthenticated]

    # @swagger_auto_schema(responses={200: CourseApiGetSchema()})
    def get(self, request):
        return Response([CourseApiGetSchema(item).data for item in request.user.courses.all()])


class InternalInstitutionApi:
    @staticmethod
    def retrieve_institution(id):
        return services.retrieve_institution(id)

    @staticmethod
    def retrieve_programs_by_id(ids: List[int]) -> List[Program]:
        return services.retrieve_programs_by_id(ids)
