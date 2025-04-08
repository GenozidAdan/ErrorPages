from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import AlumnoViewset
from django.views.generic import TemplateView

#Definir un router
router = SimpleRouter()
router.register(r'api', AlumnoViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('forms/', TemplateView.as_view(template_name='Martinez_Jair.html'), name='forms'),
]