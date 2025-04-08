from django.db import models

# Create your models here.
class Alumno(models.Model):

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    edad = models.IntegerField()
    matricula = models.CharField(max_length=15, unique=True)
    correo = models.EmailField(max_length=20, unique=True)

    def _str_(self):
        return self.nombre