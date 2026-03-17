from django.contrib import admin
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(QuizAttempt)
admin.site.register(QuizAnswer)
