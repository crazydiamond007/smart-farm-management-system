from django.contrib import admin
from .models import (
    CropType,
    Farm,
    Field,
    IrrigationEvent,
    MaintenanceTask,
    Planting,
    Sensor,
    SensorReading,
    UserProfile,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "phone_number", "created_at")
    search_fields = ("user__username", "user__email", "phone_number")
    list_filter = ("role",)


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "area_hectares", "owner_name", "is_active")
    search_fields = ("name", "location", "owner_name")
    list_filter = ("is_active",)


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ("name", "farm", "size_hectares", "soil_type", "status")
    search_fields = ("name", "farm__name", "soil_type")
    list_filter = ("status", "soil_type")


@admin.register(CropType)
class CropTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "scientific_name")
    search_fields = ("name", "scientific_name")


@admin.register(Planting)
class PlantingAdmin(admin.ModelAdmin):
    list_display = (
        "field",
        "crop_type",
        "planting_date",
        "expected_harvest_date",
        "status",
    )
    search_fields = ("field__name", "crop_type__name")
    list_filter = ("status", "planting_date")


@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = (
        "sensor_code",
        "field",
        "sensor_type",
        "installation_date",
        "status",
    )
    search_fields = ("sensor_code", "field__name", "manufacturer")
    list_filter = ("sensor_type", "status")


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ("sensor", "reading_value", "unit", "recorded_at", "quality_score")
    search_fields = ("sensor__sensor_code", "unit")
    list_filter = ("unit", "recorded_at")


@admin.register(IrrigationEvent)
class IrrigationEventAdmin(admin.ModelAdmin):
    list_display = (
        "field",
        "irrigation_date",
        "duration_minutes",
        "water_volume_litres",
        "method",
    )
    search_fields = ("field__name", "method")
    list_filter = ("method", "irrigation_date")


@admin.register(MaintenanceTask)
class MaintenanceTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "farm", "sensor", "assigned_to", "priority", "status", "due_date")
    search_fields = ("title", "farm__name", "sensor__sensor_code")
    list_filter = ("priority", "status", "due_date")