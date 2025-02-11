from .models import Strains, Requests
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Strains, Deposits, Requests
from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token["username"] = user.username
        return token


class StrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Strains
        fields = "__all__"

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requests
        fields = "__all__"

class DepositsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposits
        fields = '__all__'
# TODO: add remaining views in serializer as above

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "password2",
            "email",
            "first_name",
            "last_name",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        user.set_password(validated_data["password"])
        user.save()

        return user

class StrainByProvinceSerializer(serializers.Serializer):
    isolation_soil_province = serializers.CharField()
    strain_count = serializers.IntegerField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

class StrainByHostPlantSerializer(serializers.Serializer):
    host_plant_species = serializers.CharField()
    strain_count = serializers.IntegerField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


# class ChildIsolationProtocolSerializer(serializers.Serializer):
#     name = serializers.CharField()
#     value = serializers.IntegerField()

class IsolationProtocolSerializer(serializers.Serializer):
    isolation_protocol = serializers.CharField()
    strain_count = serializers.IntegerField()
    # children = ChildIsolationProtocolSerializer(many=True, required=False)


class TaxonomicDataSerializer(serializers.Serializer):
    taxonomic_level = serializers.CharField()
    strain_count = serializers.IntegerField()