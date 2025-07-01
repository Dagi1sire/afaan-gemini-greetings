from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import generic
from .forms import SignUpForm
from .models import VocabularyItem, GrammarTopic # Added models
from django.views.generic import TemplateView, ListView # Added ListView

class SignUpView(generic.CreateView):
    form_class = SignUpForm
    success_url = reverse_lazy('login') # Redirect to login page after successful signup
    template_name = 'learning_modules/signup.html'

class HomeView(TemplateView):
    template_name = 'learning_modules/home.html'

class VocabularyListView(ListView):
    model = VocabularyItem
    template_name = 'learning_modules/vocabulary_list.html'
    context_object_name = 'vocabulary_items'
    # paginate_by = 20 # We can add pagination later

class GrammarTopicListView(ListView):
    model = GrammarTopic
    template_name = 'learning_modules/grammartopic_list.html'
    context_object_name = 'grammartopics'
    ordering = ['order', 'title'] # Ensure consistent ordering

class GrammarTopicDetailView(generic.DetailView):
    model = GrammarTopic
    template_name = 'learning_modules/grammartopic_detail.html'
    context_object_name = 'grammartopic'

from django.contrib.auth.mixins import LoginRequiredMixin # For login protected views

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'learning_modules/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # For now, just a welcome message. Progress data can be added later.
        context['user'] = self.request.user
        # Example: Fetch UserProgress if it exists, or create it
        # progress, created = UserProgress.objects.get_or_create(user=self.request.user)
        # context['completed_vocab_count'] = progress.completed_vocabulary_items.count()
        # context['completed_grammar_count'] = progress.completed_grammar_topics.count()
        return context
