-- Bug real encontrado (2026-09-04): el progreso de un país conquistado podía
-- "des-completarse" si el navegador subía un estado local desactualizado
-- (ej. dos pestañas/dispositivos abiertos con la misma cuenta, o una sesión
-- vieja que nunca refrescó su copia local antes de volver a guardar). Como
-- el guardado es un simple upsert de "lo que diga el cliente", una copia
-- vieja en memoria podía pisar un progreso real más nuevo. Estos triggers
-- hacen que una vez completado(true) en el servidor, un guardado con false
-- NUNCA lo pueda bajar — solo puede subir, nunca bajar.
-- También corrige que `updated_at` se quedaba congelado en la fecha del
-- primer guardado de cada fila (el upsert nunca mandaba esa columna) — esto
-- rompía los filtros Semanal/Mensual del Ranking, que dependen de updated_at.

create or replace function public.proteger_progreso_pais()
returns trigger
language plpgsql
as $$
begin
  if OLD.reto_final_completado and not NEW.reto_final_completado then
    NEW.reto_final_completado := true;
  end if;
  NEW.updated_at := now();
  return NEW;
end;
$$;

drop trigger if exists progreso_pais_no_downgrade on public.progreso_pais;
create trigger progreso_pais_no_downgrade
before update on public.progreso_pais
for each row execute function public.proteger_progreso_pais();

create or replace function public.proteger_progreso_ronda()
returns trigger
language plpgsql
as $$
begin
  if OLD.completado and not NEW.completado then
    NEW.completado := true;
    NEW.aciertos := OLD.aciertos;
    NEW.total := OLD.total;
  end if;
  NEW.updated_at := now();
  return NEW;
end;
$$;

drop trigger if exists progreso_ronda_no_downgrade on public.progreso_ronda;
create trigger progreso_ronda_no_downgrade
before update on public.progreso_ronda
for each row execute function public.proteger_progreso_ronda();
