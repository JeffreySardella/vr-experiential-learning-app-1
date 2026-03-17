from django.conf import settings
from django.db import models


class Quiz(models.Model):
    title = models.CharField(max_length=100)
    course = models.ForeignKey('institution.Course', on_delete=models.CASCADE, related_name='quizzes')
    video = models.ForeignKey('video.Video', on_delete=models.CASCADE, null=True, blank=True, related_name='quizzes')
    subject = models.ForeignKey('institution.Subject', on_delete=models.CASCADE, null=True, blank=True, related_name='quizzes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_quizzes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=500)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.quiz} ({self.score}%)'


class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.question} -> {self.selected_choice}'
