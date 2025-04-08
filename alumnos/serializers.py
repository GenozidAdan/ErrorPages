from rest_framework import serializers
from .models import Alumno

#Es una clase que actua sobre un modelo
class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = '__all__' # <--- Todos los campos