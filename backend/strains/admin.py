from django.contrib import admin

# Register your models here.
from .models import Deposits, Requests, Strains
 
admin.site.register(Deposits)
admin.site.register(Requests)
admin.site.register(Strains)
