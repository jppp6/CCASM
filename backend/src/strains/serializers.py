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
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    strainsRequested = serializers.CharField(source="strains_requested")
    requestState = serializers.CharField(source="request_state")
    requestCreationDate = serializers.DateTimeField(source="request_creation_date")

    class Meta:
        model = Requests
        fields = ['request_id','firstName', 'lastName', 'affiliation', 'email', 'message', 'strainsRequested', 'requestState', 'requestCreationDate']

class DepositsSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    depositExcel = serializers.CharField(source="deposit_excel")
    depositState = serializers.CharField(source="deposit_state")
    depositCreationDate = serializers.DateTimeField(source="deposit_creation_date")

    class Meta:
        model = Deposits
        fields = ['deposit_id','firstName', 'lastName', 'affiliation', 'email', 'message', 'depositExcel', 'depositState', 'depositCreationDate']

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


# TODO: add remaining views in serializer as above
