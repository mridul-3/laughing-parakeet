from django.db import models
from django.contrib.auth.models import User

class Question(models.Model):
    ques_id = models.CharField(max_length=255, primary_key=True)
    question = models.CharField(max_length=255)
    options = models.JSONField()
    answer_idx = models.CharField(max_length=255)

    def __str__(self):
        return self.question

    def save(self, *args, **kwargs):
        import uuid
        if not self.ques_id:
            uuid = str(uuid.uuid4())
            self.ques_id = uuid
        return super(Question, self).save(*args, **kwargs)

# Create your models here.
class Quiz(models.Model):
    quiz_id = models.CharField(max_length=255, primary_key=True)
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    description = models.TextField()
    questions = models.ManyToManyField(Question, through='QuizQuestion')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        import uuid
        uuid = str(uuid.uuid4())
        self.quiz_id = uuid
        return super(Quiz, self).save(*args, **kwargs)


class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.question.ques_id

class QuizSession(models.Model):
    session_id = models.CharField(max_length=255, primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.quiz.title}"

    def save(self, *args, **kwargs):
        import uuid
        uuid = str(uuid.uuid4())
        self.session_id = uuid
        return super(QuizSession, self).save(*args, **kwargs)

class QuizSessionProgress(models.Model):
    session = models.ForeignKey(QuizSession, on_delete=models.CASCADE, related_name="progress")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    answered = models.BooleanField(default=False)
    selected_option = models.CharField(max_length=255, null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True, default=False)

    def __str__(self):
        return f"{self.session.quiz.title} - {self.question.question} (Order: {self.order})"