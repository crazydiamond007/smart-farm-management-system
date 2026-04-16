from rest_framework import serializers

from .models import (
    CropType,
    Farm,
    Field,
    IrrigationEvent,
    MaintenanceTask,
    Planting,
    Sensor,
)


class FarmSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = Farm
        fields = [
            "id",
            "name",
            "location",
            "area_hectares",
            "owner_name",
            "is_active",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_by_username", "created_at", "updated_at"]


class FieldSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source="farm.name", read_only=True)

    class Meta:
        model = Field
        fields = [
            "id",
            "farm",
            "farm_name",
            "name",
            "size_hectares",
            "soil_type",
            "irrigation_type",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class SensorSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source="field.name", read_only=True)
    farm_name = serializers.CharField(source="field.farm.name", read_only=True)

    class Meta:
        model = Sensor
        fields = [
            "id",
            "field",
            "field_name",
            "farm_name",
            "sensor_code",
            "sensor_type",
            "installation_date",
            "status",
            "manufacturer",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class CropTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropType
        fields = [
            "id",
            "name",
            "scientific_name",
            "ideal_temperature_min",
            "ideal_temperature_max",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class PlantingSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source="field.name", read_only=True)
    farm_name = serializers.CharField(source="field.farm.name", read_only=True)
    crop_type_name = serializers.CharField(source="crop_type.name", read_only=True)

    class Meta:
        model = Planting
        fields = [
            "id",
            "field",
            "field_name",
            "farm_name",
            "crop_type",
            "crop_type_name",
            "planting_date",
            "expected_harvest_date",
            "actual_harvest_date",
            "planted_area_hectares",
            "status",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_by",
            "field_name",
            "farm_name",
            "crop_type_name",
            "created_at",
            "updated_at",
        ]


class IrrigationEventSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source="field.name", read_only=True)
    farm_name = serializers.CharField(source="field.farm.name", read_only=True)
    performed_by_username = serializers.CharField(source="performed_by.username", read_only=True)

    class Meta:
        model = IrrigationEvent
        fields = [
            "id",
            "field",
            "field_name",
            "farm_name",
            "irrigation_date",
            "duration_minutes",
            "water_volume_litres",
            "method",
            "performed_by",
            "performed_by_username",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "field_name",
            "farm_name",
            "performed_by",
            "performed_by_username",
            "created_at",
            "updated_at",
        ]


class MaintenanceTaskSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source="farm.name", read_only=True)
    sensor_code = serializers.CharField(source="sensor.sensor_code", read_only=True)
    assigned_to_username = serializers.CharField(source="assigned_to.username", read_only=True)

    class Meta:
        model = MaintenanceTask
        fields = [
            "id",
            "farm",
            "farm_name",
            "sensor",
            "sensor_code",
            "title",
            "description",
            "assigned_to",
            "assigned_to_username",
            "due_date",
            "priority",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "farm_name",
            "sensor_code",
            "assigned_to_username",
            "created_at",
            "updated_at",
        ]