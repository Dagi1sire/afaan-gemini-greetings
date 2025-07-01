from django.contrib import admin
from .models import VocabularyItem, GrammarTopic, UserProgress

@admin.register(VocabularyItem)
class VocabularyItemAdmin(admin.ModelAdmin):
    list_display = ('afaan_oromo_word', 'translation_english', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('afaan_oromo_word', 'translation_english')

@admin.register(GrammarTopic)
class GrammarTopicAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title',)
    ordering = ('order',)

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'completed_vocabulary_count', 'completed_grammar_count')
    search_fields = ('user__username',) # Search by username

    def completed_vocabulary_count(self, obj):
        return obj.completed_vocabulary_items.count()
    completed_vocabulary_count.short_description = 'Completed Vocabulary Items'

    def completed_grammar_count(self, obj):
        return obj.completed_grammar_topics.count()
    completed_grammar_count.short_description = 'Completed Grammar Topics'

# Alternatively, for simple registration without customization:
# admin.site.register(VocabularyItem)
# admin.site.register(GrammarTopic)
# admin.site.register(UserProgress)
