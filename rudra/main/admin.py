from django.contrib import admin

from main.models import Quiz, Question, QuizQuestion, QuizSession, QuizSessionProgress

# Register your models here.
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(QuizQuestion)
admin.site.register(QuizSession)
admin.site.register(QuizSessionProgress)