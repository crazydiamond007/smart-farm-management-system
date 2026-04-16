from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import (
    CropType,
    Farm,
    Field,
    IrrigationEvent,
    MaintenanceTask,
    Planting,
    Sensor,
)
from .serializers import (
    CropTypeSerializer,
    FarmSerializer,
    FieldSerializer,
    IrrigationEventSerializer,
    MaintenanceTaskSerializer,
    PlantingSerializer,
    SensorSerializer,
)


class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.select_related("created_by").all()
    serializer_class = FarmSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active"]
    search_fields = ["name", "location", "owner_name"]
    ordering_fields = ["name", "area_hectares", "created_at"]
    ordering = ["name"]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.select_related("farm").all()
    serializer_class = FieldSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["farm", "status", "soil_type"]
    search_fields = ["name", "farm__name", "soil_type", "irrigation_type"]
    ordering_fields = ["name", "size_hectares", "created_at"]
    ordering = ["farm__name", "name"]


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.select_related("field", "field__farm").all()
    serializer_class = SensorSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["field", "sensor_type", "status"]
    search_fields = ["sensor_code", "field__name", "field__farm__name", "manufacturer"]
    ordering_fields = ["sensor_code", "installation_date", "created_at"]
    ordering = ["sensor_code"]


class CropTypeViewSet(viewsets.ModelViewSet):
    queryset = CropType.objects.all()
    serializer_class = CropTypeSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "scientific_name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]


class PlantingViewSet(viewsets.ModelViewSet):
    queryset = Planting.objects.select_related("field", "field__farm", "crop_type", "created_by").all()
    serializer_class = PlantingSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["field", "crop_type", "status"]
    search_fields = ["field__name", "field__farm__name", "crop_type__name"]
    ordering_fields = ["planting_date", "expected_harvest_date", "created_at"]
    ordering = ["-planting_date"]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()


class IrrigationEventViewSet(viewsets.ModelViewSet):
    queryset = IrrigationEvent.objects.select_related("field", "field__farm", "performed_by").all()
    serializer_class = IrrigationEventSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["field", "method"]
    search_fields = ["field__name", "field__farm__name", "method", "notes"]
    ordering_fields = ["irrigation_date", "duration_minutes", "water_volume_litres", "created_at"]
    ordering = ["-irrigation_date"]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(performed_by=self.request.user)
        else:
            serializer.save()


class MaintenanceTaskViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceTask.objects.select_related("farm", "sensor", "assigned_to").all()
    serializer_class = MaintenanceTaskSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["farm", "sensor", "priority", "status"]
    search_fields = ["title", "description", "farm__name", "sensor__sensor_code"]
    ordering_fields = ["due_date", "priority", "status", "created_at"]
    ordering = ["due_date", "priority"]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(assigned_to=self.request.user)
        else:
            serializer.save()