from django.urls import re_path as url

from main import views

urlpatterns = [
    url(r'^create_quiz/', views.create_quiz),
    url(r'^start_quiz/', views.start_quiz),
    url(r'^submit_answer/', views.submit_answer),
]