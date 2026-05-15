
-- =========================================================
-- SMART FARM MANAGEMENT SYSTEM
-- FUNCTIONS, PROCEDURES, AND TRIGGERS
-- =========================================================



-- =========================================================
-- FUNCTION 1:
-- Get total planted area for a farm
-- =========================================================

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



-- =========================================================
-- FUNCTION 2:
-- Count active sensors for a farm
-- =========================================================

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



-- =========================================================
-- PROCEDURE 1:
-- Add planting and update field status
-- =========================================================

CREATE OR REPLACE PROCEDURE add_planting(
    p_field_id INT,
    p_crop_name VARCHAR,
    p_planted_area NUMERIC,
    p_planting_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO core_planting (
        field_id,
        crop_name,
        planted_area_hectares,
        planting_date
    )
    VALUES (
        p_field_id,
        p_crop_name,
        p_planted_area,
        p_planting_date
    );

    UPDATE core_field
    SET status = 'in_use',
        updated_at = NOW()
    WHERE id = p_field_id;

END;
$$;



-- =========================================================
-- PROCEDURE 2:
-- Deactivate a sensor
-- =========================================================

CREATE OR REPLACE PROCEDURE deactivate_sensor(
    p_sensor_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE core_sensor
    SET status = 'inactive',
        updated_at = NOW()
    WHERE id = p_sensor_id;

END;
$$;



-- =========================================================
-- PROCEDURE 3:
-- Complete maintenance task and reactivate sensor
-- =========================================================

CREATE OR REPLACE PROCEDURE complete_maintenance_task(
    p_task_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sensor_id INT;
BEGIN

    UPDATE core_maintenancetask
    SET status = 'completed',
        updated_at = NOW()
    WHERE id = p_task_id;

    SELECT sensor_id
    INTO v_sensor_id
    FROM core_maintenancetask
    WHERE id = p_task_id;

    IF v_sensor_id IS NOT NULL THEN

        UPDATE core_sensor
        SET status = 'active',
            updated_at = NOW()
        WHERE id = v_sensor_id;

    END IF;

END;
$$;



-- =========================================================
-- TRIGGER FUNCTION 1:
-- Validate planting area does not exceed field size
-- =========================================================

CREATE OR REPLACE FUNCTION validate_planting_area()
RETURNS TRIGGER AS $$
DECLARE
    field_size NUMERIC;
BEGIN

    SELECT size_hectares
    INTO field_size
    FROM core_field
    WHERE id = NEW.field_id;

    IF NEW.planted_area_hectares > field_size THEN

        RAISE EXCEPTION
        'Planted area (%) cannot exceed field size (%)',
        NEW.planted_area_hectares,
        field_size;

    END IF;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;



DROP TRIGGER IF EXISTS trg_validate_planting_area
ON core_planting;



CREATE TRIGGER trg_validate_planting_area
BEFORE INSERT OR UPDATE
ON core_planting
FOR EACH ROW
EXECUTE FUNCTION validate_planting_area();



-- =========================================================
-- TRIGGER FUNCTION 2:
-- Automatically set field to in_use after planting
-- =========================================================

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



DROP TRIGGER IF EXISTS trg_set_field_in_use_on_planting
ON core_planting;



CREATE TRIGGER trg_set_field_in_use_on_planting
AFTER INSERT
ON core_planting
FOR EACH ROW
EXECUTE FUNCTION set_field_in_use_on_planting();



-- =========================================================
-- TRIGGER FUNCTION 3:
-- Set sensor to maintenance when critical task exists
-- =========================================================

CREATE OR REPLACE FUNCTION sync_sensor_status_from_task()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.sensor_id IS NOT NULL
       AND NEW.priority = 'critical'
       AND NEW.status IN ('pending', 'in_progress')
    THEN

        UPDATE core_sensor
        SET status = 'maintenance',
            updated_at = NOW()
        WHERE id = NEW.sensor_id;

    END IF;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;



DROP TRIGGER IF EXISTS trg_sync_sensor_status_from_task
ON core_maintenancetask;



CREATE TRIGGER trg_sync_sensor_status_from_task
AFTER INSERT OR UPDATE
ON core_maintenancetask
FOR EACH ROW
EXECUTE FUNCTION sync_sensor_status_from_task();



-- =========================================================
-- TESTING SECTION
-- =========================================================

-- Test function 1
-- SELECT get_total_planted_area_for_farm(1);

-- Test function 2
-- SELECT get_active_sensor_count_for_farm(1);

-- Test procedure 1
-- CALL add_planting(1, 'Corn', 5.5, '2026-05-15');

-- Test procedure 2
-- CALL deactivate_sensor(3);

-- Test procedure 3
-- CALL complete_maintenance_task(2);
