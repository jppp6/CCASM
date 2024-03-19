"""
URL configuration for src project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from strains import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Will probably have to change these urls to follow some convention
urlpatterns = [
    path("admin/", admin.site.urls),

    path('api/collection/', views.get_collection),
    path('api/deposit/', views.post_deposit),
    path('api/request/', views.post_request),


 
    path('api/admin/collection/', views.admin_get_collection),
    path('api/admin/add-strain/', views.admin_add_single_strain),
    path('api/admin/add-strains/', views.admin_add_bulk_strain),
    path('api/admin/update-strain/', views.admin_update_strain),
    path('api/admin/deposits/', views.admin_get_deposits),
    path('api/admin/update-deposit/', views.admin_update_deposit),
    path('api/admin/requests/', views.admin_get_requests),
    path('api/admin/update-request/', views.admin_update_request),

    

    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshToken/', TokenRefreshView.as_view(), name='token_refresh'),
]
