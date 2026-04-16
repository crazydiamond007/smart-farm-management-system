-- 1. Count fields per farm
SELECT f.name AS farm_name, COUNT(fi.id) AS total_fields
FROM core_farm f
LEFT JOIN core_field fi ON fi.farm_id = f.id
GROUP BY f.id, f.name
ORDER BY total_fields DESC;

-- 2. Count sensors per farm
SELECT f.name AS farm_name, COUNT(s.id) AS total_sensors
FROM core_farm f
LEFT JOIN core_field fi ON fi.farm_id = f.id
LEFT JOIN core_sensor s ON s.field_id = fi.id
GROUP BY f.id, f.name
ORDER BY total_sensors DESC;

-- 3. Total planted area by crop type
SELECT c.name AS crop_type, SUM(p.planted_area_hectares) AS total_planted_area
FROM core_planting p
JOIN core_croptype c ON c.id = p.crop_type_id
GROUP BY c.id, c.name
ORDER BY total_planted_area DESC;

-- 4. Active sensors currently under maintenance/inactive
SELECT sensor_code, sensor_type, status, manufacturer
FROM core_sensor
WHERE status IN ('maintenance', 'inactive')
ORDER BY status, sensor_code;

-- 5. Average irrigation water volume per field
SELECT fi.name AS field_name, AVG(i.water_volume_litres) AS avg_water_volume
FROM core_irrigationevent i
JOIN core_field fi ON fi.id = i.field_id
GROUP BY fi.id, fi.name
ORDER BY avg_water_volume DESC;

-- 6. Pending and in-progress maintenance tasks
SELECT title, priority, status, due_date
FROM core_maintenancetask
WHERE status IN ('pending', 'in_progress')
ORDER BY due_date ASC NULLS LAST, priority DESC;

-- 7. Farms with growing plantings and active sensors
SELECT DISTINCT f.name AS farm_name
FROM core_farm f
JOIN core_field fi ON fi.farm_id = f.id
JOIN core_planting p ON p.field_id = fi.id
JOIN core_sensor s ON s.field_id = fi.id
WHERE p.status = 'growing'
  AND s.status = 'active'
ORDER BY farm_name;