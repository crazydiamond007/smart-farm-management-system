INSERT INTO core_croptype (name, scientific_name, ideal_temperature_min, ideal_temperature_max, notes, created_at, updated_at)
VALUES
('Maize', 'Zea mays', 18.00, 30.00, 'Common cereal crop', NOW(), NOW()),
('Tomato', 'Solanum lycopersicum', 20.00, 28.00, 'Vegetable crop', NOW(), NOW()),
('Wheat', 'Triticum aestivum', 10.00, 25.00, 'Staple grain crop', NOW(), NOW());

INSERT INTO core_farm (name, location, area_hectares, owner_name, is_active, created_at, updated_at, created_by_id)
VALUES
('Green Valley Farm', 'Nicosia', 150.50, 'Elias Demetriou', TRUE, NOW(), NOW(), NULL),
('Sunrise Agro Farm', 'Famagusta', 98.75, 'Narcisse Kabongo', TRUE, NOW(), NOW(), NULL),
('Blue Ridge Estate', 'Kyrenia', 212.30, 'Andreas Georgiou', TRUE, NOW(), NOW(), NULL),
('Olive Grove Station', 'Morphou', 175.00, 'Maria Christou', TRUE, NOW(), NOW(), NULL),
('Harvest Edge Farm', 'Larnaca', 130.20, 'Samuel Moyo', TRUE, NOW(), NOW(), NULL);

INSERT INTO core_field (farm_id, name, size_hectares, soil_type, irrigation_type, status, created_at, updated_at)
VALUES
(1, 'Field A1', 25.00, 'Loamy', 'Drip', 'available', NOW(), NOW()),
(1, 'Field A2', 18.50, 'Clay', 'Sprinkler', 'in_use', NOW(), NOW()),
(2, 'Field B1', 22.75, 'Sandy Loam', 'Drip', 'available', NOW(), NOW()),
(2, 'Field B2', 15.40, 'Loamy', 'Manual', 'maintenance', NOW(), NOW()),
(3, 'Field C1', 30.10, 'Clay Loam', 'Sprinkler', 'available', NOW(), NOW()),
(4, 'Field D1', 28.00, 'Silt Loam', 'Drip', 'in_use', NOW(), NOW()),
(5, 'Field E1', 19.90, 'Loamy', 'Surface', 'available', NOW(), NOW()),
(5, 'Field E2', 17.80, 'Sandy', 'Manual', 'available', NOW(), NOW());

INSERT INTO core_sensor (field_id, sensor_code, sensor_type, installation_date, status, manufacturer, created_at, updated_at)
VALUES
(1, 'TEMP-A1-01', 'temperature', '2026-01-10', 'active', 'AgriSense', NOW(), NOW()),
(1, 'SM-A1-02', 'soil_moisture', '2026-01-12', 'active', 'AgriSense', NOW(), NOW()),
(2, 'HUM-A2-01', 'humidity', '2026-02-01', 'active', 'FieldTech', NOW(), NOW()),
(3, 'PH-B1-01', 'ph', '2026-02-15', 'maintenance', 'CropLogic', NOW(), NOW()),
(4, 'TEMP-B2-01', 'temperature', '2026-03-01', 'inactive', 'AgriSense', NOW(), NOW()),
(5, 'LIGHT-C1-01', 'light', '2026-01-25', 'active', 'FieldTech', NOW(), NOW()),
(6, 'SM-D1-01', 'soil_moisture', '2026-02-18', 'active', 'CropLogic', NOW(), NOW()),
(7, 'TEMP-E1-01', 'temperature', '2026-03-05', 'active', 'AgriSense', NOW(), NOW()),
(8, 'HUM-E2-01', 'humidity', '2026-03-07', 'active', 'FieldTech', NOW(), NOW()),
(3, 'SM-B1-02', 'soil_moisture', '2026-02-20', 'active', 'AgriSense', NOW(), NOW());

INSERT INTO core_planting (field_id, crop_type_id, planting_date, expected_harvest_date, actual_harvest_date, planted_area_hectares, status, created_at, updated_at, created_by_id)
VALUES
(1, 1, '2026-02-01', '2026-06-15', NULL, 20.00, 'growing', NOW(), NOW(), NULL),
(2, 2, '2026-01-20', '2026-04-30', NULL, 12.00, 'growing', NOW(), NOW(), NULL),
(3, 3, '2026-02-10', '2026-07-01', NULL, 18.00, 'planned', NOW(), NOW(), NULL),
(5, 1, '2026-03-01', '2026-07-20', NULL, 24.00, 'growing', NOW(), NOW(), NULL),
(6, 2, '2026-01-25', '2026-05-10', NULL, 16.50, 'growing', NOW(), NOW(), NULL),
(7, 3, '2026-02-18', '2026-07-12', NULL, 14.00, 'planned', NOW(), NOW(), NULL),
(8, 1, '2026-03-05', '2026-08-01', NULL, 13.00, 'planned', NOW(), NOW(), NULL),
(4, 2, '2026-01-15', '2026-04-20', '2026-04-18', 10.00, 'harvested', NOW(), NOW(), NULL);

INSERT INTO core_irrigationevent (field_id, irrigation_date, duration_minutes, water_volume_litres, method, notes, created_at, updated_at, performed_by_id)
VALUES
(1, '2026-04-01 08:00:00', 45, 1200.00, 'drip', 'Morning cycle', NOW(), NOW(), NULL),
(2, '2026-04-01 16:00:00', 30, 800.00, 'sprinkler', 'Evening irrigation', NOW(), NOW(), NULL),
(3, '2026-04-02 07:30:00', 50, 1400.00, 'drip', 'Field hydration', NOW(), NOW(), NULL),
(5, '2026-04-02 15:30:00', 40, 1000.00, 'sprinkler', 'Pre-heat adjustment', NOW(), NOW(), NULL),
(6, '2026-04-03 09:00:00', 35, 900.00, 'drip', 'Routine watering', NOW(), NOW(), NULL),
(7, '2026-04-03 17:15:00', 25, 650.00, 'surface', 'Manual support cycle', NOW(), NOW(), NULL);

INSERT INTO core_maintenancetask (farm_id, sensor_id, title, description, due_date, priority, status, created_at, updated_at, assigned_to_id)
VALUES
(1, 1, 'Check temperature sensor calibration', 'Verify temperature drift on TEMP-A1-01', '2026-04-20', 'medium', 'pending', NOW(), NOW(), NULL),
(2, 4, 'Repair pH sensor casing', 'Sensor casing cracked after weather exposure', '2026-04-18', 'high', 'in_progress', NOW(), NOW(), NULL),
(3, NULL, 'Inspect sprinkler lines', 'Routine inspection of irrigation network', '2026-04-25', 'medium', 'pending', NOW(), NOW(), NULL),
(4, 7, 'Clean soil moisture sensor', 'Moisture readings fluctuating abnormally', '2026-04-19', 'high', 'pending', NOW(), NOW(), NULL),
(5, NULL, 'General field equipment review', 'Monthly equipment audit', '2026-04-30', 'low', 'pending', NOW(), NOW(), NULL),
(2, 5, 'Replace inactive temperature sensor', 'Sensor no longer reporting', '2026-04-17', 'critical', 'in_progress', NOW(), NOW(), NULL);