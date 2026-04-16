from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model that adds created_at and updated_at fields
    to any model that inherits from it.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserProfile(TimeStampedModel):
    """
    Extra profile data for Django users.
    We still use Django's built-in User model for authentication.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        FARM_MANAGER = "farm_manager", "Farm Manager"
        TECHNICAL_STAFF = "technical_staff", "Technical Staff"
        EMPLOYEE = "employee", "Employee / Data Entry"
        VIEWER = "viewer", "Viewer"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.VIEWER,
    )

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


class Farm(TimeStampedModel):
    """
    Top-level farming site or operation.
    """

    name = models.CharField(max_length=150, unique=True)
    location = models.CharField(max_length=255)
    area_hectares = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    owner_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="farms_created",
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Field(TimeStampedModel):
    """
    A field belongs to one farm.
    """

    farm = models.ForeignKey(
        Farm,
        on_delete=models.CASCADE,
        related_name="fields",
    )
    name = models.CharField(max_length=120)
    size_hectares = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    soil_type = models.CharField(max_length=100)
    irrigation_type = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default="available")

    class Meta:
        ordering = ["farm__name", "name"]
        unique_together = ("farm", "name")

    def __str__(self):
        return f"{self.farm.name} - {self.name}"


class CropType(TimeStampedModel):
    """
    Reference table for crop categories.
    """

    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    ideal_temperature_min = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )
    ideal_temperature_max = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Planting(TimeStampedModel):
    """
    Tracks which crop is planted in which field.
    """

    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        GROWING = "growing", "Growing"
        HARVESTED = "harvested", "Harvested"
        FAILED = "failed", "Failed"

    field = models.ForeignKey(
        Field,
        on_delete=models.CASCADE,
        related_name="plantings",
    )
    crop_type = models.ForeignKey(
        CropType,
        on_delete=models.PROTECT,
        related_name="plantings",
    )
    planting_date = models.DateField()
    expected_harvest_date = models.DateField(null=True, blank=True)
    actual_harvest_date = models.DateField(null=True, blank=True)
    planted_area_hectares = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="plantings_created",
    )

    class Meta:
        ordering = ["-planting_date"]

    def __str__(self):
        return f"{self.crop_type.name} in {self.field.name}"


class Sensor(TimeStampedModel):
    """
    Sensor devices assigned to fields.
    """

    class SensorType(models.TextChoices):
        TEMPERATURE = "temperature", "Temperature"
        HUMIDITY = "humidity", "Humidity"
        SOIL_MOISTURE = "soil_moisture", "Soil Moisture"
        PH = "ph", "pH"
        LIGHT = "light", "Light"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        MAINTENANCE = "maintenance", "Maintenance"

    field = models.ForeignKey(
        Field,
        on_delete=models.CASCADE,
        related_name="sensors",
    )
    sensor_code = models.CharField(max_length=50, unique=True)
    sensor_type = models.CharField(max_length=30, choices=SensorType.choices)
    installation_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    manufacturer = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["sensor_code"]

    def __str__(self):
        return f"{self.sensor_code} ({self.get_sensor_type_display()})"


class SensorReading(TimeStampedModel):
    """
    Recorded sensor values over time.
    """

    sensor = models.ForeignKey(
        Sensor,
        on_delete=models.CASCADE,
        related_name="readings",
    )
    reading_value = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    recorded_at = models.DateTimeField()
    quality_score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=100,
    )

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self):
        return f"{self.sensor.sensor_code} - {self.reading_value} {self.unit}"


class IrrigationEvent(TimeStampedModel):
    """
    Stores irrigation records for a field.
    """

    field = models.ForeignKey(
        Field,
        on_delete=models.CASCADE,
        related_name="irrigation_events",
    )
    irrigation_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    water_volume_litres = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    method = models.CharField(max_length=100)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="irrigation_events_performed",
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-irrigation_date"]

    def __str__(self):
        return f"{self.field.name} - {self.irrigation_date.strftime('%Y-%m-%d %H:%M')}"


class MaintenanceTask(TimeStampedModel):
    """
    Technical and operational work orders.
    """

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    farm = models.ForeignKey(
        Farm,
        on_delete=models.CASCADE,
        related_name="maintenance_tasks",
    )
    sensor = models.ForeignKey(
        Sensor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_tasks",
    )
    title = models.CharField(max_length=150)
    description = models.TextField()
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks_assigned",
    )
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    class Meta:
        ordering = ["due_date", "priority", "title"]

    def __str__(self):
        return self.title