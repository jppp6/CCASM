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

urlpatterns = [
    path('admin/', admin.site.urls),
    path('strains/', views.strain_list)
    # path(''. include(router.urls)),/?
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('strains', views.StrainsViewSet.as_view()),
    #TODO: add viewsets for remaining views
]

#this might break here?
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)