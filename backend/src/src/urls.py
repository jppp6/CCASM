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
    path('strains/all/', views.get_strain_all),
    path('strains/collection/', views.get_strain_browse),
    path('strains/<int:ccasm_id>/', views.strain_details),
    path('strains/post/', views.post_strain),
    path('requests/', views.get_requests_all),
    path('requests/<int:request_id>', views.requests_details),
    path('requests/post', views.post_request),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refreshToken/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register')
]
