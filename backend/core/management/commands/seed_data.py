from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import (
    CropType, Farm, Field, Sensor,
    Planting, IrrigationEvent, MaintenanceTask
)


class Command(BaseCommand):
    help = "Seed database with sample data"

    def handle(self, *args, **kwargs):
        now = timezone.now()

        # Clear existing data (optional)
        MaintenanceTask.objects.all().delete()
        IrrigationEvent.objects.all().delete()
        Planting.objects.all().delete()
        Sensor.objects.all().delete()
        Field.objects.all().delete()
        Farm.objects.all().delete()
        CropType.objects.all().delete()

        # -------------------
        # Crop Types
        # -------------------
        maize = CropType.objects.create(
            name="Maize",
            scientific_name="Zea mays",
            ideal_temperature_min=18,
            ideal_temperature_max=30,
            notes="Common cereal crop",
            created_at=now,
            updated_at=now
        )

        tomato = CropType.objects.create(
            name="Tomato",
            scientific_name="Solanum lycopersicum",
            ideal_temperature_min=20,
            ideal_temperature_max=28,
            notes="Vegetable crop",
            created_at=now,
            updated_at=now
        )

        wheat = CropType.objects.create(
            name="Wheat",
            scientific_name="Triticum aestivum",
            ideal_temperature_min=10,
            ideal_temperature_max=25,
            notes="Staple grain crop",
            created_at=now,
            updated_at=now
        )

        # -------------------
        # Farms
        # -------------------
        farm1 = Farm.objects.create(name="Green Valley Farm", location="Nicosia", area_hectares=150.5, owner_name="Elias Demetriou", is_active=True)
        farm2 = Farm.objects.create(name="Sunrise Agro Farm", location="Famagusta", area_hectares=98.75, owner_name="Narcisse Kabongo", is_active=True)
        farm3 = Farm.objects.create(name="Blue Ridge Estate", location="Kyrenia", area_hectares=212.3, owner_name="Andreas Georgiou", is_active=True)
        farm4 = Farm.objects.create(name="Olive Grove Station", location="Morphou", area_hectares=175.0, owner_name="Maria Christou", is_active=True)
        farm5 = Farm.objects.create(name="Harvest Edge Farm", location="Larnaca", area_hectares=130.2, owner_name="Samuel Moyo", is_active=True)

        # -------------------
        # Fields
        # -------------------
        field1 = Field.objects.create(farm=farm1, name="Field A1", size_hectares=25, soil_type="Loamy", irrigation_type="Drip", status="available")
        field2 = Field.objects.create(farm=farm1, name="Field A2", size_hectares=18.5, soil_type="Clay", irrigation_type="Sprinkler", status="in_use")
        field3 = Field.objects.create(farm=farm2, name="Field B1", size_hectares=22.75, soil_type="Sandy Loam", irrigation_type="Drip", status="available")
        field4 = Field.objects.create(farm=farm2, name="Field B2", size_hectares=15.4, soil_type="Loamy", irrigation_type="Manual", status="maintenance")
        field5 = Field.objects.create(farm=farm3, name="Field C1", size_hectares=30.1, soil_type="Clay Loam", irrigation_type="Sprinkler", status="available")
        field6 = Field.objects.create(farm=farm4, name="Field D1", size_hectares=28.0, soil_type="Silt Loam", irrigation_type="Drip", status="in_use")
        field7 = Field.objects.create(farm=farm5, name="Field E1", size_hectares=19.9, soil_type="Loamy", irrigation_type="Surface", status="available")
        field8 = Field.objects.create(farm=farm5, name="Field E2", size_hectares=17.8, soil_type="Sandy", irrigation_type="Manual", status="available")

        # -------------------
        # Sensors
        # -------------------
        Sensor.objects.create(field=field1, sensor_code="TEMP-A1-01", sensor_type="temperature", installation_date="2026-01-10", status="active", manufacturer="AgriSense")
        Sensor.objects.create(field=field1, sensor_code="SM-A1-02", sensor_type="soil_moisture", installation_date="2026-01-12", status="active", manufacturer="AgriSense")
        Sensor.objects.create(field=field2, sensor_code="HUM-A2-01", sensor_type="humidity", installation_date="2026-02-01", status="active", manufacturer="FieldTech")
        Sensor.objects.create(field=field3, sensor_code="PH-B1-01", sensor_type="ph", installation_date="2026-02-15", status="maintenance", manufacturer="CropLogic")
        Sensor.objects.create(field=field4, sensor_code="TEMP-B2-01", sensor_type="temperature", installation_date="2026-03-01", status="inactive", manufacturer="AgriSense")
        Sensor.objects.create(field=field5, sensor_code="LIGHT-C1-01", sensor_type="light", installation_date="2026-01-25", status="active", manufacturer="FieldTech")
        Sensor.objects.create(field=field6, sensor_code="SM-D1-01", sensor_type="soil_moisture", installation_date="2026-02-18", status="active", manufacturer="CropLogic")
        Sensor.objects.create(field=field7, sensor_code="TEMP-E1-01", sensor_type="temperature", installation_date="2026-03-05", status="active", manufacturer="AgriSense")
        Sensor.objects.create(field=field8, sensor_code="HUM-E2-01", sensor_type="humidity", installation_date="2026-03-07", status="active", manufacturer="FieldTech")
        Sensor.objects.create(field=field3, sensor_code="SM-B1-02", sensor_type="soil_moisture", installation_date="2026-02-20", status="active", manufacturer="AgriSense")

        # -------------------
        # Plantings
        # -------------------
        Planting.objects.create(field=field1, crop_type=maize, planting_date="2026-02-01", expected_harvest_date="2026-06-15", planted_area_hectares=20, status="growing")
        Planting.objects.create(field=field2, crop_type=tomato, planting_date="2026-01-20", expected_harvest_date="2026-04-30", planted_area_hectares=12, status="growing")
        Planting.objects.create(field=field3, crop_type=wheat, planting_date="2026-02-10", expected_harvest_date="2026-07-01", planted_area_hectares=18, status="planned")
        Planting.objects.create(field=field5, crop_type=maize, planting_date="2026-03-01", expected_harvest_date="2026-07-20", planted_area_hectares=24, status="growing")

        # -------------------
        # Irrigation Events
        # -------------------
        IrrigationEvent.objects.create(field=field1, irrigation_date="2026-04-01 08:00:00", duration_minutes=45, water_volume_litres=1200, method="drip", notes="Morning cycle")
        IrrigationEvent.objects.create(field=field2, irrigation_date="2026-04-01 16:00:00", duration_minutes=30, water_volume_litres=800, method="sprinkler", notes="Evening irrigation")

        # -------------------
        # Maintenance Tasks
        # -------------------
        MaintenanceTask.objects.create(farm=farm1, sensor=None, title="Check temperature sensor calibration", description="Verify temperature drift", due_date="2026-04-20", priority="medium", status="pending")
        MaintenanceTask.objects.create(farm=farm2, sensor=None, title="Repair pH sensor casing", description="Sensor casing cracked", due_date="2026-04-18", priority="high", status="in_progress")

        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))