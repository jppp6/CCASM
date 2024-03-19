from django.contrib import admin
from django.urls import include, path
#from django.conf.urls.static import static
#from django.conf import settings
from rest_framework import routers
from . import views

# router = routers.DefaultRouter()
# router.register(r'strains', views.Strains)
#TODO: add router.register for the remaining schemas below...
#i.e. router.register(r'deposits', views.Deposits) etc. etc.


#this might break here?
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)