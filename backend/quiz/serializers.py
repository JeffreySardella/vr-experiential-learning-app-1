from rest_framework import serializers
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']


class StudentChoiceSerializer(serializers.ModelSerializer):
    """Choice serializer that hides is_correct for students."""
    class Meta:
        model = Choice
        fields = ['id', 'text']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'order', 'choices']
        read_only_fields = ['id', 'quiz']


class StudentQuestionSerializer(serializers.ModelSerializer):
    """Question serializer that hides is_correct on choices for students."""
    choices = StudentChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'order', 'choices']
        read_only_fields = ['id', 'quiz']


class QuizListSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'video', 'subject', 'created_by', 'created_at', 'question_count']
        read_only_fields = ['id', 'created_by', 'created_at']

    def get_question_count(self, obj):
        return obj.questions.count()


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'video', 'subject', 'created_by', 'created_at', 'questions']
        read_only_fields = ['id', 'created_by', 'created_at']


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'video', 'subject']
        read_only_fields = ['id']


class QuestionCreateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    order = serializers.IntegerField(default=0)
    choices = serializers.ListField(child=serializers.DictField(), min_length=1)


class QuizAnswerSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()


class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'completed_at', 'answers']

    def get_answers(self, obj):
        return QuizAnswerSerializer(obj.answers.all(), many=True).data


class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['id', 'question', 'selected_choice']
