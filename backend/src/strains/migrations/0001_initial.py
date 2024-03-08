# Generated by Django 4.2.7 on 2024-03-04 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Deposits',
            fields=[
                ('deposit_id', models.SmallAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField(blank=True, null=True)),
                ('deposit_excel', models.TextField(blank=True, null=True)),
                ('deposit_state', models.CharField(blank=True, max_length=16, null=True)),
                ('deposit_creation_date', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'deposits',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Requestedstrains',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'requestedstrains',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Requests',
            fields=[
                ('request_id', models.SmallAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField(blank=True, null=True)),
                ('request_state', models.CharField(blank=True, max_length=16, null=True)),
                ('request_creation_date', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'requests',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Strains',
            fields=[
                ('ccasm_id', models.SmallAutoField(primary_key=True, serialize=False)),
                ('strain_name', models.CharField(blank=True, max_length=128, null=True)),
                ('binomial_classification', models.CharField(blank=True, max_length=128, null=True)),
                ('taxonomic_lineage', models.TextField(blank=True, null=True)),
                ('risk_group', models.IntegerField(blank=True, null=True)),
                ('is_plant_pathogen', models.IntegerField(blank=True, null=True)),
                ('colony_morphology', models.CharField(blank=True, max_length=128, null=True)),
                ('host_plant_species', models.CharField(blank=True, max_length=128, null=True)),
                ('isolation_source', models.CharField(blank=True, max_length=64, null=True)),
                ('isolation_year', models.IntegerField(blank=True, null=True)),
                ('isolation_protocol', models.CharField(blank=True, max_length=25, null=True)),
                ('isolation_growth_medium', models.CharField(blank=True, max_length=128, null=True)),
                ('isolation_growth_temperature', models.IntegerField(blank=True, null=True)),
                ('isolation_growth_medium_composition', models.CharField(blank=True, max_length=128, null=True)),
                ('isolation_soil_ph', models.FloatField(blank=True, null=True)),
                ('isolation_soil_organic_matter', models.CharField(blank=True, max_length=128, null=True)),
                ('isolation_soil_texture', models.CharField(blank=True, max_length=128, null=True)),
                ('isolation_soil_province', models.CharField(blank=True, max_length=2, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('genome_ncbi_association', models.CharField(blank=True, max_length=128, null=True)),
                ('genome_size', models.FloatField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('citation_deposit_time', models.DateTimeField(blank=True, null=True)),
                ('photo', models.CharField(blank=True, max_length=1024, null=True)),
            ],
            options={
                'db_table': 'strains',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('login_id', models.SmallAutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=64)),
                ('password', models.CharField(max_length=64)),
                ('first_name', models.CharField(blank=True, max_length=64, null=True)),
                ('last_name', models.CharField(blank=True, max_length=64, null=True)),
                ('email', models.CharField(max_length=64)),
            ],
            options={
                'db_table': 'users',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Webusers',
            fields=[
                ('user_id', models.SmallAutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(blank=True, max_length=64, null=True)),
                ('last_name', models.CharField(blank=True, max_length=64, null=True)),
                ('affiliation', models.CharField(blank=True, max_length=64, null=True)),
                ('email', models.CharField(blank=True, max_length=64, null=True)),
            ],
            options={
                'db_table': 'webusers',
                'managed': False,
            },
        ),
    ]