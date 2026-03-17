from django.urls import path
from quiz.apis import QuizListApi, QuizByIdApi, QuizQuestionsApi, QuizQuestionByIdApi, QuizAttemptApi, QuizResultsApi

urlpatterns = [
    path('', QuizListApi.as_view()),
    path('<int:quiz_id>/', QuizByIdApi.as_view()),
    path('<int:quiz_id>/questions/', QuizQuestionsApi.as_view()),
    path('<int:quiz_id>/questions/<int:question_id>/', QuizQuestionByIdApi.as_view()),
    path('<int:quiz_id>/attempt/', QuizAttemptApi.as_view()),
    path('<int:quiz_id>/results/', QuizResultsApi.as_view()),
]
