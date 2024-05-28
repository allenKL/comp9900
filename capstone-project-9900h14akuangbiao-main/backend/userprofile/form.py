from django import forms
from django.contrib.auth.models import User

# Login form
class UserLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()
    
# Register form
class UserRegisterForm(forms.ModelForm):
    # rewrite the password field
    password = forms.CharField()
    password2 = forms.CharField()

    class Meta:
        model = User
        fields = ('username', 'email')

    # check the 2 passwords
    def clean_password2(self):
        data = self.cleaned_data
        if data.get('password') == data.get('password2'):
            return data.get('password')
        else:
            raise forms.ValidationError("Passwords don't match. Please input 2 same passwords.")