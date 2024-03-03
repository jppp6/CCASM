from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from models import *
from rest_framework.mixins import (
    CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from .serializers import StrainSerializer

#Not sure if the following was the right approach (did not use rest_framework)
'''
# Create your views here.
@require_GET
def get_strain_by_strainID(request, strain_id : int):
    try:
        strain = Strains.objects.get(id=strain_id)
        data = {
            'ccasm_id': strain.ccasm_id,
            'strain_name': strain.strain_name,
            'binomial_classification': strain.binomalal_classification,
            'taxonomic_lineage': strain.taxonomic_lineage,
            'risk_group': strain.risk_group,
            'is_plant_pathogen': strain.is_plant_pathogen,
            'colony_morphology': strain.colony_morphology,
            'host_plant_species': strain.host_plant_species,
            'isolation_source': strain.isolation_source,
            'isolation_year': strain.isolation_year,
            'isolation_protocol': strain.isolation_protocol,
            'isolation_growth_medium': strain.isolation_growth_medium,
            'isolation_growth_temperature': strain.isolation_growth_temperature,
            'isolation_growth_medium_composition': strain.isolation_growth_medium_composition,
            'isolation_soil_ph': strain.isolation_soil_ph,
            'isolation_soil_organic_matter': strain.isolation_soil_organic_matter,
            'isolation_soil_texture': strain.isolation_soil_texture,
            'isolation_soil_province': strain.isolation_soil_province,
            'longitude': strain.longitude,
            'latitude': strain.latitude,
            'genome_ncbi_association': strain.genome_ncbi_association,
            'genome_size': strain.genome_size,
            'notes': strain.notes,
            'citation_deposit_time': strain.citation_deposit_time,
            'photo': strain.photo
        }
        return JsonResponse(data)
    except Strains.DoesNotExist:
        return JsonResponse({'error': 'Strain not found'}, status=404)
    
@require_GET
def get_strains(request):
    strains = Strains.objects.all()
    data = [{
            'ccasm_id': strain.ccasm_id,
            'strain_name': strain.strain_name,
            'binomial_classification': strain.binomalal_classification,
            'taxonomic_lineage': strain.taxonomic_lineage,
            'risk_group': strain.risk_group,
            'is_plant_pathogen': strain.is_plant_pathogen,
            'colony_morphology': strain.colony_morphology,
            'host_plant_species': strain.host_plant_species,
            'isolation_source': strain.isolation_source,
            'isolation_year': strain.isolation_year,
            'isolation_protocol': strain.isolation_protocol,
            'isolation_growth_medium': strain.isolation_growth_medium,
            'isolation_growth_temperature': strain.isolation_growth_temperature,
            'isolation_growth_medium_composition': strain.isolation_growth_medium_composition,
            'isolation_soil_ph': strain.isolation_soil_ph,
            'isolation_soil_organic_matter': strain.isolation_soil_organic_matter,
            'isolation_soil_texture': strain.isolation_soil_texture,
            'isolation_soil_province': strain.isolation_soil_province,
            'longitude': strain.longitude,
            'latitude': strain.latitude,
            'genome_ncbi_association': strain.genome_ncbi_association,
            'genome_size': strain.genome_size,
            'notes': strain.notes,
            'citation_deposit_time': strain.citation_deposit_time,
            'photo': strain.photo
            } for strain in strains]
    return JsonResponse({'strains': data})
'''

class StrainsViewSet(GenericViewSet,  # generic view functionality
                     CreateModelMixin,  # handles POSTs
                     RetrieveModelMixin,  # handles GETs for 1 Company
                     UpdateModelMixin,  # handles PUTs and PATCHes
                     ListModelMixin):  # handles GETs for many Companies
    serializer_class = StrainSerializer
    queryset = Strains.objects.all()