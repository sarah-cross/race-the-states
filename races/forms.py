# races/forms.py

from django import forms
from .models import Race  
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RaceForm(forms.ModelForm):
    class Meta:
        model = Race
        fields = ['race_name', 'race_date', 'race_notes', 'race_time']


class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']