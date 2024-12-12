import json
from datetime import timezone, datetime

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from main.models import Quiz, QuizQuestion, Question, QuizSession, QuizSessionProgress
from django.http import JsonResponse

# Create your views here.

@csrf_exempt
def create_quiz(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            quiz = Quiz.objects.create(title=data['title'], description=data['description'])

            no_of_questions = data['no_of_questions']
            # randomly select questions from the database
            questions = Question.objects.all().order_by('?')[:no_of_questions]
            for question in questions:
                QuizQuestion.objects.create(quiz=quiz, question=question)
            return JsonResponse({'quiz_id': quiz.quiz_id}, status=201)
        return JsonResponse({'error': 'Invalid request'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'{str(e)}'}, status=400)

@csrf_exempt
def start_quiz(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            quiz_id = data['quiz_id']
            quiz = Quiz.objects.get(quiz_id=quiz_id)

            session = QuizSession.objects.create(quiz=quiz)
            selected_questions = QuizQuestion.objects.filter(quiz=quiz)
            # selected_questions = [question.question for question in selected_questions]
            for idx, question in enumerate(selected_questions, start=1):
                print(idx, question)
                QuizSessionProgress.objects.create(
                    session=session,
                    question_id=question,
                    order=idx,
                )

            #return the question and options for the first question
            first_question = QuizSessionProgress.objects.get(session=session, order=1)
            question = first_question.question
            options = question.options
            return JsonResponse({"question": {'question': question.question, 'options': options, "question_id": question.ques_id,
                                  "session_id": session.session_id}}, status=200)
        return JsonResponse({'error': 'Invalid request'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'{str(e)}'}, status=400)

@csrf_exempt
def submit_answer(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            question_id = data['ques_id']
            selected_option = data['selected_option']
            session_id = data['session_id']

            session = QuizSession.objects.get(session_id=session_id)
            question = Question.objects.get(ques_id=question_id)
            progress = QuizSessionProgress.objects.get(session=session, question=question)

            progress.answered = True
            progress.selected_option = selected_option
            if selected_option == question.answer_idx:
                session.score += 1
                progress.is_correct = True
            progress.save()
            session.save()

            next_question = QuizSessionProgress.objects.filter(session_id=session_id, answered=False).order_by('order').first()
            print("next", next_question)
            if not next_question:
                session.completed = True
                session.completed_at = datetime.now(timezone.utc)
                session.save()
                return JsonResponse({'message': 'Quiz completed successfully', 'score': session.score}, status=200)

            next_question_data = {
                "question_id": next_question.question.ques_id,
                "question": next_question.question.question,
                "options": next_question.question.options,
            }

            return JsonResponse({'message': 'Answer submitted successfully', "question": next_question_data}, status=200)
        return JsonResponse({'error': 'Invalid request'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'{str(e)}'}, status=400)

