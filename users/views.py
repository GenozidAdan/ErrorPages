from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
#Falta importar el modelo
from .models import CustomUser
#Falta importar el serializador
from .serializers import CustomUserSerializer
from rest_framework.renderers import JSONRenderer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomUserCreationForm

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    renderer_classes = [JSONRenderer]

    #Como le pongo seguridad?
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]

    #Sobreescribir el metodo para la obtención de permisos
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            # Checar si tenemos sesión 
            return [IsAuthenticated()]
        #Dar acceso a todo lo demas sin estar logueado
        return []

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from django.contrib.auth.models import User
from .forms import CustomUserCreationForm
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class CustomUserFormAPI(APIView):
    def get(self, request, *args, **kwargs):
        form = CustomUserCreationForm()
        fields = {
            field: {
            'label': form[field].label,
            'input':form[field].field.widget.attrs,
            'type': form[field].field.widget.input_type,
            }
                for field in form.fields
        }
        return Response(fields)
    
    def post(self, request, *args, **kwargs):
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            user_data = form.cleaned_data
            User = get_user_model()
            user = User.objects.create_user(
            email=user_data['email'],
            password=user_data['password1'],
            name=user_data['name'],
            surname=user_data['surname'],
            control_number=user_data['control_number'],
            age=user_data['age'],
            tel=user_data['tel'],
            )
            return Response({'message': 'Usuario creado con éxito'},status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteUserByEmail(APIView):
    def delete(self, request, email, *args, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
            user.delete()
            return Response({"message": "Usuario eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"message": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .forms import CustomUserCreationForm

class UserUpdateAPI(APIView):
    def put(self, request, *args, **kwargs):
        email = kwargs.get("email")  
        try:
            user = get_user_model().objects.get(email=email)
        except get_user_model().DoesNotExist:
            return Response({"message": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Usar el formulario de creación para validar y actualizar los datos
        form = CustomUserCreationForm(request.data)
        form.instance = user  # Asignar la instancia de usuario al formulario

        if form.is_valid():
            # Limpiar los datos validados del formulario
            user_data = form.cleaned_data
            user.email = user_data['email']
            user.name = user_data['name']
            user.surname = user_data['surname']
            user.control_number = user_data['control_number']
            user.age = user_data['age']
            user.tel = user_data['tel']

            # Si se proporcionó una nueva contraseña, actualizarla
            if user_data.get('password1'):
                user.set_password(user_data['password1'])

            # Guardar los cambios en el usuario
            user.save()

            return Response({"message": "Usuario actualizado correctamente"}, status=status.HTTP_200_OK)
        
        # Si el formulario no es válido, devolver los errores
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
