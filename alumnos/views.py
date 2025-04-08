from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from .models import Alumno
from .serializers import AlumnoSerializer

class AlumnoViewset(viewsets.ModelViewSet):
    #Conjunto de querys de la BD
    queryset = Alumno.objects.all()

    #Saber como empaquetar y enviar la información
    serializer_class = AlumnoSerializer

    #Saber como voy a renderizar las respuestas
    renderer_classes = [JSONRenderer]