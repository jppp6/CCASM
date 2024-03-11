from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Deposits, Requests, Strains, Users, Webusers
from .serializers import StrainSerializer
#Not sure if the following was the right approach (did not use rest_framework)

@api_view(['GET'])
def get_strain_all(request):
    strains = Strains.objects.all()
    serializer = StrainSerializer(strains, many=True)
    return Response({'strains': serializer.data})

# This will just add a single strain
@api_view(['GET', 'PUT', 'DELETE'])
def strain_details(request, ccasm_id):
    # See if exists
    try:
        strain = Strains.objects.get(pk=ccasm_id)
    except Strains.DoesNotExist:
        return Response(status= status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        seralizer = StrainSerializer(strain)
        return Response(seralizer.data)
    
    elif request.method == 'PUT':
        seralizer = StrainSerializer(strain, data=request.data)
        if seralizer.is_valid():
            seralizer.save()
            return Response(seralizer.data)
        return Response(seralizer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        strain.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view('POST')
def post_strain(request):
    serializer = StrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# This will do the bulk upload
# This will need the django csv reader to work
@api_view("POST")
def post_csv(request):
    pass