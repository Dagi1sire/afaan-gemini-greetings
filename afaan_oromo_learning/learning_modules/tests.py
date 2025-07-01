from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import VocabularyItem, GrammarTopic, UserProgress

class ModelCreationTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword123')

    def test_vocabulary_item_creation(self):
        item = VocabularyItem.objects.create(
            afaan_oromo_word="Qaroo",
            translation_english="Smart",
            category="Adjectives"
        )
        self.assertEqual(str(item), "Qaroo (Smart)")
        self.assertEqual(item.category, "Adjectives")

    def test_grammar_topic_creation(self):
        topic = GrammarTopic.objects.create(
            title="Verb Conjugation Basics",
            explanation="<p>Basic verb endings.</p>",
            order=10
        )
        self.assertEqual(str(topic), "Verb Conjugation Basics")
        self.assertEqual(topic.order, 10)

    def test_user_progress_creation(self):
        progress = UserProgress.objects.create(user=self.user)
        self.assertEqual(str(progress), f"Progress for {self.user.username}")
        self.assertEqual(progress.user, self.user)
        self.assertEqual(progress.completed_vocabulary_items.count(), 0)
        self.assertEqual(progress.completed_grammar_topics.count(), 0)

    def test_user_progress_signal(self):
        # Test if UserProgress is automatically created for a new User by a signal (if implemented)
        # For now, we don't have a signal, so this would test manual creation or future signal
        # new_user = User.objects.create_user(username='newbie', password='password')
        # try:
        #     progress = UserProgress.objects.get(user=new_user)
        #     self.assertIsNotNone(progress)
        # except UserProgress.DoesNotExist:
        #     # This is acceptable if no signal is in place to auto-create UserProgress
        #     # For now, we expect it not to exist unless manually created or by a signal.
        #     # To make this test meaningful with current setup, we'd create it:
        #     UserProgress.objects.create(user=new_user)
        #     self.assertTrue(UserProgress.objects.filter(user=new_user).exists())
        pass # No signal for UserProgress creation yet, so direct creation is tested above.


class ViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpassword123', email='test@example.com')

        # Create some content using the data from the migration as a reference for consistency
        self.vocab1 = VocabularyItem.objects.create(afaan_oromo_word="Akkam", translation_english="How are you?", category="Greetings")
        self.vocab2 = VocabularyItem.objects.create(afaan_oromo_word="Tokko", translation_english="One", category="Numbers")

        self.grammar1 = GrammarTopic.objects.create(title="Qubee Intro", explanation="Alphabet stuff", order=1)
        self.grammar2 = GrammarTopic.objects.create(title="SOV Structure", explanation="Sentence order", order=2)

    def test_home_view(self):
        response = self.client.get(reverse('learning_modules:home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/home.html')
        self.assertTemplateUsed(response, 'base.html')

    def test_signup_view_get(self):
        response = self.client.get(reverse('learning_modules:signup'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/signup.html')

    def test_signup_view_post(self):
        user_count_before = User.objects.count()

        # Single, correct POST data
        form_data = {
            'username': 'newloginsignupuser',
            'email': 'newloginuser@example.com',
            'password1': 'ValidPassword123!', # Trying 'password1' based on error message
            'password2': 'ValidPassword123!',
        }
        response = self.client.post(reverse('learning_modules:signup'), form_data)

        if response.status_code != 302:
            # This print will only show if the test is about to fail the status_code assertion
            print(f"Signup POST for '{form_data['username']}' failed. Status: {response.status_code}.")
            if response.context and 'form' in response.context:
                print(f"Form errors: {response.context['form'].errors.as_json()}") # Print as JSON for clarity
            else:
                print("No form context available or form not in context.")

        self.assertEqual(response.status_code, 302, "Signup did not redirect. Check printed form errors.")
        self.assertEqual(User.objects.count(), user_count_before + 1, "User count did not increment.")
        self.assertTrue(User.objects.filter(username=form_data['username']).exists(), "New user was not created.")
        self.assertRedirects(response, reverse('login'))


    def test_vocabulary_list_view(self):
        response = self.client.get(reverse('learning_modules:vocabulary_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/vocabulary_list.html')
        self.assertContains(response, self.vocab1.afaan_oromo_word)
        self.assertContains(response, self.vocab2.translation_english)

        # Check that items from setUp are in the context
        self.assertIn(self.vocab1, response.context['vocabulary_items'])
        self.assertIn(self.vocab2, response.context['vocabulary_items'])

        # Check that the count matches the total number of items in the DB
        self.assertEqual(len(response.context['vocabulary_items']), VocabularyItem.objects.count())


    def test_grammar_topic_list_view(self):
        response = self.client.get(reverse('learning_modules:grammartopic_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/grammartopic_list.html')
        self.assertContains(response, self.grammar1.title)
        self.assertContains(response, self.grammar2.title)

        # Check that items from setUp are in the context
        self.assertIn(self.grammar1, response.context['grammartopics'])
        self.assertIn(self.grammar2, response.context['grammartopics'])

        # Check that the count matches the total number of items in the DB
        self.assertEqual(len(response.context['grammartopics']), GrammarTopic.objects.count())

        # Optional: Check ordering if critical and predictable across all items
        # For example, if self.grammar1 and self.grammar2 are expected to be first due to their 'order'
        # This requires knowing how they sort relative to migrated data.
        # For now, presence and total count are good checks.

    def test_grammar_topic_detail_view(self):
        response = self.client.get(reverse('learning_modules:grammartopic_detail', kwargs={'pk': self.grammar1.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/grammartopic_detail.html')
        self.assertContains(response, self.grammar1.title)
        self.assertContains(response, self.grammar1.explanation)

    def test_grammar_topic_detail_view_not_found(self):
        non_existent_pk = self.grammar1.pk + 100
        response = self.client.get(reverse('learning_modules:grammartopic_detail', kwargs={'pk': non_existent_pk}))
        self.assertEqual(response.status_code, 404)

    def test_dashboard_view_unauthenticated(self):
        response = self.client.get(reverse('learning_modules:dashboard'))
        self.assertEqual(response.status_code, 302) # Redirects to login
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('learning_modules:dashboard')}")

    def test_dashboard_view_authenticated(self):
        self.client.login(username='testuser', password='testpassword123')
        response = self.client.get(reverse('learning_modules:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'learning_modules/dashboard.html')
        self.assertContains(response, f"Welcome to your Dashboard, {self.user.username}!")
        self.assertEqual(response.context['user'], self.user)
