from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
from quiz.serializers import (
    QuizListSerializer,
    QuizDetailSerializer,
    QuizCreateSerializer,
    QuestionSerializer,
    StudentQuestionSerializer,
    QuestionCreateSerializer,
    QuizAttemptSerializer,
    QuizAnswerSubmitSerializer,
)


class QuizListApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        course_id = request.query_params.get('course_id')
        quizzes = Quiz.objects.all()
        if course_id:
            quizzes = quizzes.filter(course_id=course_id)
        serializer = QuizListSerializer(quizzes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuizCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = QuizDetailSerializer(quiz)
        return Response(serializer.data)

    def patch(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = QuizCreateSerializer(quiz, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuizQuestionsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Students see choices without is_correct
        is_student = request.user.groups.filter(name='student').exists()
        questions = quiz.questions.all()
        if is_student:
            serializer = StudentQuestionSerializer(questions, many=True)
        else:
            serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        question = Question.objects.create(
            quiz=quiz,
            text=data['text'],
            order=data.get('order', 0),
        )

        for choice_data in data['choices']:
            Choice.objects.create(
                question=question,
                text=choice_data.get('text', ''),
                is_correct=choice_data.get('is_correct', False),
            )

        result = QuestionSerializer(question)
        return Response(result.data, status=status.HTTP_201_CREATED)


class QuizQuestionByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, quiz_id, question_id):
        try:
            question = Question.objects.get(id=question_id, quiz_id=quiz_id)
        except Question.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if 'text' in request.data:
            question.text = request.data['text']
        if 'order' in request.data:
            question.order = request.data['order']
        question.save()

        # Update choices if provided
        if 'choices' in request.data:
            question.choices.all().delete()
            for choice_data in request.data['choices']:
                Choice.objects.create(
                    question=question,
                    text=choice_data.get('text', ''),
                    is_correct=choice_data.get('is_correct', False),
                )

        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    def delete(self, request, quiz_id, question_id):
        try:
            question = Question.objects.get(id=question_id, quiz_id=quiz_id)
        except Question.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class QuizAttemptApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        answers_data = request.data.get('answers', [])
        if not answers_data:
            return Response({'error': 'No answers provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate score
        correct = 0
        total = len(answers_data)
        answer_objects = []

        for answer in answers_data:
            serializer = QuizAnswerSubmitSerializer(data=answer)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            question_id = serializer.validated_data['question_id']
            choice_id = serializer.validated_data['choice_id']

            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
                choice = Choice.objects.get(id=choice_id, question=question)
            except (Question.DoesNotExist, Choice.DoesNotExist):
                return Response(
                    {'error': f'Invalid question or choice id'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if choice.is_correct:
                correct += 1

            answer_objects.append({
                'question': question,
                'selected_choice': choice,
            })

        score = round((correct / total) * 100, 1) if total > 0 else 0

        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=score,
        )

        for answer_data in answer_objects:
            QuizAnswer.objects.create(
                attempt=attempt,
                question=answer_data['question'],
                selected_choice=answer_data['selected_choice'],
            )

        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuizResultsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Students see only their own attempts; instructors/admins see all
        is_student = request.user.groups.filter(name='student').exists()
        if is_student:
            attempts = QuizAttempt.objects.filter(quiz=quiz, user=request.user)
        else:
            attempts = QuizAttempt.objects.filter(quiz=quiz)

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)
