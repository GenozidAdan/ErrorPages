from django import forms
from .models import Alumno

class alumnoForm(forms.ModelForm):
    class Meta:
        model = Alumno
        fields = ['nombre', 'apellido', 'edad', 'matricula', 'correo']