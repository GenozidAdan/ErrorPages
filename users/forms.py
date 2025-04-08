from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm

class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(
        label='Contraseña',
        widget = forms.PasswordInput(
            attrs = {
                'class':'form-control',
                'pattern': '^(?=.*\d)(?=.*[A-Z])(?=.*[!#$%&?]).{8,}$',
                'placeholder': 'Ingrese su contraseña',
                'title': 'Necesitas definir una contraseña segura: Al menos un número.\nAl menos una letra mayúscula.\nAl menos un carácter especial (!#$%&?).\nMínimo de 8 caracteres en total.',
                'required': True
            }
        )
    )
    ##password2
    password2 = forms.CharField(
        label='Repite tu Contraseña',
        widget = forms.PasswordInput(
            attrs = {
                'class':'form-control',
                'pattern': '^(?=.*\d)(?=.*[A-Z])(?=.*[!#$%&?]).{8,}$',
                'placeholder': 'Repita su contraseña',
                'title': 'Necesitas definir una contraseña segura',
                'required': True
            }
        )
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'surname', 'control_number', 'age', 'tel','password1', 'password2']

        #Si quiero editar la forma de los inputs necesito widgets
        widgets = {
            #Cada uno de los widgets del **MODELO**
            'email': forms.EmailInput(
                attrs = {
                    'class':'form-control',
                    'required': True,
                    'pattern': '^[a-zA-Z0-9]+@utez\.edu\.mx$',
                    'title': 'Debes ingresar un correo electrónico valido de la UTEZ'
                }
            ),
            'name': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'required': True
                }
            ),
            'surname': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'required': True
                }
            ),
            'control_number': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'required': True,
                    'pattern': '^[0-9]{5}[a-zA-Z]{2}[0-9]{3}$',
                    'title': 'Necesitas ingresar una matricula valida de la UTEZ',
                    'maxlength': '20'
                }
            ),
            'age': forms.NumberInput(
                attrs={
                    'class':'form-control',
                    'required': True,
                    'pattern': '^[0-9]+$',
                    'title': 'Ingrese solo numeros',
                    'max': '100',
                    'min': '1'
                }
            ),
            'tel': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'required': True,
                    'pattern': '^[0-9\+-]{10,}$',
                    'title': 'Ingrese solo numeros',
                    'maxlength': '15'
                }
            )
        }

class CustomUserLoginForm(AuthenticationForm):
    pass