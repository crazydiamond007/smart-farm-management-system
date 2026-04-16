-- 1. Function: total planted area for a farm
CREATE OR REPLACE FUNCTION get_total_planted_area_for_farm(p_farm_id INT)
RETURNS NUMERIC AS $$
DECLARE
    total_area NUMERIC;
BEGIN
    SELECT COALESCE(SUM(p.planted_area_hectares), 0)
    INTO total_area
    FROM core_planting p
    JOIN core_field fi ON fi.id = p.field_id
    WHERE fi.farm_id = p_farm_id;

    RETURN total_area;
END;
$$ LANGUAGE plpgsql;

-- 2. Function: count active sensors for a farm
CREATE OR REPLACE FUNCTION get_active_sensor_count_for_farm(p_farm_id INT)
RETURNS INT AS $$
DECLARE
    sensor_count INT;
BEGIN
    SELECT COUNT(s.id)
    INTO sensor_count
    FROM core_sensor s
    JOIN core_field fi ON fi.id = s.field_id
    WHERE fi.farm_id = p_farm_id
      AND s.status = 'active';

    RETURN sensor_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger function: validate planting area does not exceed field size
CREATE OR REPLACE FUNCTION validate_planting_area()
RETURNS TRIGGER AS $$
DECLARE
    field_size NUMERIC;
BEGIN
    SELECT size_hectares INTO field_size
    FROM core_field
    WHERE id = NEW.field_id;

    IF NEW.planted_area_hectares > field_size THEN
        RAISE EXCEPTION 'Planted area (%.2f) cannot exceed field size (%.2f)',
            NEW.planted_area_hectares, field_size;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_planting_area
BEFORE INSERT OR UPDATE ON core_planting
FOR EACH ROW
EXECUTE FUNCTION validate_planting_area();

-- 4. Trigger function: set field status to in_use when a planting is inserted
CREATE OR REPLACE FUNCTION set_field_in_use_on_planting()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE core_field
    SET status = 'in_use',
        updated_at = NOW()
    WHERE id = NEW.field_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_field_in_use_on_planting
AFTER INSERT ON core_planting
FOR EACH ROW
EXECUTE FUNCTION set_field_in_use_on_planting();

-- 5. Trigger function: set sensor status to maintenance when maintenance task is critical and pending/in progress
CREATE OR REPLACE FUNCTION sync_sensor_status_from_task()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sensor_id IS NOT NULL
       AND NEW.priority = 'critical'
       AND NEW.status IN ('pending', 'in_progress') THEN
        UPDATE core_sensor
        SET status = 'maintenance',
            updated_at = NOW()
        WHERE id = NEW.sensor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_sensor_status_from_task
AFTER INSERT OR UPDATE ON core_maintenancetask
FOR EACH ROW
EXECUTE FUNCTION sync_sensor_status_from_task();