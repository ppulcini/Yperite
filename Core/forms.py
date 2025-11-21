from django import forms


class connexionForm(forms.Form):
    Username = forms.CharField(label="Username", max_length=100)
    Password = forms.CharField(label="Password", widget=forms.PasswordInput)