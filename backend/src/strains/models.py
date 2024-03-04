# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Deposits(models.Model):
    deposit_id = models.SmallAutoField(primary_key=True)
    user = models.ForeignKey('Webusers', models.DO_NOTHING, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    deposit_excel = models.TextField(blank=True, null=True)
    deposit_state = models.CharField(max_length=16, blank=True, null=True)
    deposit_creation_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'deposits'


class Requestedstrains(models.Model):
    request = models.ForeignKey('Webusers', models.DO_NOTHING)
    ccasm = models.ForeignKey('Strains', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'requestedstrains'


class Requests(models.Model):
    request_id = models.SmallAutoField(primary_key=True)
    user = models.ForeignKey('Webusers', models.DO_NOTHING, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    request_state = models.CharField(max_length=16, blank=True, null=True)
    request_creation_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'requests'


class Strains(models.Model):
    ccasm_id = models.SmallAutoField(primary_key=True)
    strain_name = models.CharField(max_length=128, blank=True, null=True)
    binomial_classification = models.CharField(max_length=128, blank=True, null=True)
    taxonomic_lineage = models.TextField(blank=True, null=True)
    risk_group = models.IntegerField(blank=True, null=True)
    is_plant_pathogen = models.IntegerField(blank=True, null=True)
    colony_morphology = models.CharField(max_length=128, blank=True, null=True)
    host_plant_species = models.CharField(max_length=128, blank=True, null=True)
    isolation_source = models.CharField(max_length=64, blank=True, null=True)
    isolation_year = models.IntegerField(blank=True, null=True)
    isolation_protocol = models.CharField(max_length=25, blank=True, null=True)
    isolation_growth_medium = models.CharField(max_length=128, blank=True, null=True)
    isolation_growth_temperature = models.IntegerField(blank=True, null=True)
    isolation_growth_medium_composition = models.CharField(max_length=128, blank=True, null=True)
    isolation_soil_ph = models.FloatField(blank=True, null=True)
    isolation_soil_organic_matter = models.CharField(max_length=128, blank=True, null=True)
    isolation_soil_texture = models.CharField(max_length=128, blank=True, null=True)
    isolation_soil_province = models.CharField(max_length=2, blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    genome_ncbi_association = models.CharField(max_length=128, blank=True, null=True)
    genome_size = models.FloatField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    citation_deposit_time = models.DateTimeField(blank=True, null=True)
    photo = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'strains'


class Users(models.Model):
    login_id = models.SmallAutoField(primary_key=True)
    username = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    first_name = models.CharField(max_length=64, blank=True, null=True)
    last_name = models.CharField(max_length=64, blank=True, null=True)
    email = models.CharField(max_length=64)

    class Meta:
        managed = False
        db_table = 'users'


class Webusers(models.Model):
    user_id = models.SmallAutoField(primary_key=True)
    first_name = models.CharField(max_length=64, blank=True, null=True)
    last_name = models.CharField(max_length=64, blank=True, null=True)
    affiliation = models.CharField(max_length=64, blank=True, null=True)
    email = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'webusers'
