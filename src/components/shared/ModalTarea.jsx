import { useEffect } from "react";
import { useForm } from "react-hook-form";

const hoy = () => new Date().toISOString().split("T")[0];

export default function ModalTarea({ show, onClose, onGuardar, onBorrar, onToggleEstado, seccion, accentClass, tareaInicial }) {
  const esEdicion = !!tareaInicial;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (show) {
      reset(
        esEdicion
          ? { fecha: tareaInicial.fecha, urgencia: tareaInicial.urgencia, responsable: tareaInicial.responsable, descripcion: tareaInicial.descripcion }
          : { fecha: hoy(), urgencia: "baja", responsable: "", descripcion: "" }
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show, reset, esEdicion, tareaInicial]);

  const onSubmit = (data) => {
    onGuardar({ ...data, _id: tareaInicial?._id, seccion });
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-sheet" role="dialog" aria-modal="true">

        <div className="modal-sheet__header">
          <h2 className="modal-sheet__title">{esEdicion ? "Editar tarea" : "Nueva tarea"}</h2>
          <button className="modal-sheet__close" onClick={onClose} aria-label="Cerrar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form className="modal-sheet__body" onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="field-group" style={{ maxWidth: "50%" }}>
            <label className="field-label" htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              className="field-input field-input--readonly"
              readOnly
              {...register("fecha")}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="descripcion">Tarea</label>
            <textarea
              id="descripcion"
              rows={4}
              className={`field-input field-input--textarea ${errors.descripcion ? "field-input--error" : ""}`}
              placeholder="Describí la tarea..."
              {...register("descripcion", { required: "Requerido" })}
            />
            {errors.descripcion && <span className="field-error">{errors.descripcion.message}</span>}
          </div>

          <div className="field-inline">
            <label className="field-label field-label--inline" htmlFor="urgencia">Urgencia</label>
            <select id="urgencia" className="field-input field-input--select field-input--inline" {...register("urgencia")}>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="field-inline">
            <label className="field-label field-label--inline" htmlFor="responsable">Responsable</label>
            <select
              id="responsable"
              className={`field-input field-input--select field-input--inline ${errors.responsable ? "field-input--error" : ""}`}
              {...register("responsable", { required: "Requerido" })}
            >
              <option value="">Seleccioná...</option>
              <option value="Nacho">Nacho</option>
              <option value="Jorge">Jorge</option>
              <option value="Javier">Javier</option>
              <option value="Victor">Victor</option>
              <option value="Gustavo">Gustavo</option>
              <option value="Kevin">Kevin</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.responsable && <span className="field-error">{errors.responsable.message}</span>}
          </div>

          <div className="modal-sheet__actions">
            {esEdicion && (
              <>
                <button type="button" className="btn-estado" onClick={() => { onToggleEstado(tareaInicial._id); onClose(); }}>
                  {tareaInicial.completado ? "Pendiente" : "Terminada"}
                </button>
                <button type="button" className="btn-borrar" onClick={() => { onBorrar(tareaInicial._id); onClose(); }}>
                  Borrar
                </button>
              </>
            )}
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className={`btn-submit ${accentClass}`}>
              {esEdicion ? "Guardar cambios" : "Guardar tarea"}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
