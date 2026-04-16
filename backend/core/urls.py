from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CropTypeViewSet,
    FarmViewSet,
    FieldViewSet,
    IrrigationEventViewSet,
    MaintenanceTaskViewSet,
    PlantingViewSet,
    SensorViewSet,
)

router = DefaultRouter()
router.register("farms", FarmViewSet, basename="farm")
router.register("fields", FieldViewSet, basename="field")
router.register("sensors", SensorViewSet, basename="sensor")
router.register("crop-types", CropTypeViewSet, basename="crop-type")
router.register("plantings", PlantingViewSet, basename="planting")
router.register("irrigation-events", IrrigationEventViewSet, basename="irrigation-event")
router.register("maintenance-tasks", MaintenanceTaskViewSet, basename="maintenance-task")

urlpatterns = [
    path("", include(router.urls)),
]