from django.db import models
from django.contrib.auth.models import User

class VocabularyItem(models.Model):
    afaan_oromo_word = models.CharField(max_length=200)
    translation_english = models.CharField(max_length=200)
    # Using CharField for audio URL/path for now, can be FileField later
    pronunciation_audio_url = models.CharField(max_length=255, blank=True, null=True)
    example_sentence_afaan = models.TextField(blank=True, null=True)
    example_sentence_translation = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, help_text="e.g., greetings, numbers, animals")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.afaan_oromo_word} ({self.translation_english})"

    class Meta:
        ordering = ['afaan_oromo_word']


class GrammarTopic(models.Model):
    title = models.CharField(max_length=200)
    explanation = models.TextField(help_text="Can include HTML for formatting.")
    order = models.IntegerField(default=0, help_text="Order in which topics are presented.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order', 'title']


class UserProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="progress")
    completed_vocabulary_items = models.ManyToManyField(VocabularyItem, blank=True, related_name="completed_by_users")
    completed_grammar_topics = models.ManyToManyField(GrammarTopic, blank=True, related_name="completed_by_users")
    # We might add specific scores or last_completed_date here later

    def __str__(self):
        return f"Progress for {self.user.username}"

    class Meta:
        verbose_name_plural = "User Progress"
