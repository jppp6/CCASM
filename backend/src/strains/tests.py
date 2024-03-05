from django.test import TestCase
from rest_framework import status

# Create your tests here.
from .serializers import *
from .models import *
from .views import *

class StrainEndpointTester(TestCase):
    
    def test_get_strains(self):
        pass


