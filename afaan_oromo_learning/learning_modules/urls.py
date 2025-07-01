from django.urls import path
from . import views
from .views import (
    SignUpView, HomeView, VocabularyListView,
    GrammarTopicListView, GrammarTopicDetailView,
    DashboardView
)

app_name = 'learning_modules'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('vocabulary/', VocabularyListView.as_view(), name='vocabulary_list'),
    path('grammar/', GrammarTopicListView.as_view(), name='grammartopic_list'),
    path('grammar/<int:pk>/', GrammarTopicDetailView.as_view(), name='grammartopic_detail'),
]
