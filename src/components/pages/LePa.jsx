import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalTarea from "../shared/ModalTarea";
import ModalVerTarea from "../shared/ModalVerTarea";
import TareaCard from "../shared/TareaCard";
import Toast from "../shared/Toast";
import { getEventos, createEvento, updateEvento, deleteEvento } from "../../helpers/eventosApi";

export default function LePa() {
  const [tareas, setTareas]           = useState([]);
  const [showNueva, setShowNueva]     = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);
  const [tareaVer, setTareaVer]       = useState(null);
  const [cargando, setCargando]       = useState(true);
  const [toast, setToast]             = useState(null);

  useEffect(() => {
    getEventos("lepa")
      .then(setTareas)
      .finally(() => setCargando(false));
  }, []);

  const handleGuardar = async (data) => {
    if (data._id) {
      const actualizada = await updateEvento(data._id, data);
      setTareas((prev) => prev.map((t) => (t._id === actualizada._id ? actualizada : t)));
      setToast("Tarea actualizada");
    } else {
      const nueva = await createEvento("lepa", data);
      setTareas((prev) => [...prev, nueva]);
      setToast("Tarea creada");
    }
  };

  const handleCompletar = async (id) => {
    await deleteEvento(id);
    setTareas((prev) => prev.filter((t) => t._id !== id));
    setToast("Tarea terminada");
  };

  const handleBorrar = async (id) => {
    await deleteEvento(id);
    setTareas((prev) => prev.filter((t) => t._id !== id));
    setToast("Tarea borrada");
  };

  const tareasPendientes = tareas
    .filter((t) => !t.completado)
    .sort((a, b) => (a.urgencia === b.urgencia ? 0 : a.urgencia === "alta" ? -1 : 1));

  return (
    <div className="inner-page inner-page--lepa">
      <div className="floating-card">

        <header className="floating-card__header floating-card__header--lepa">
          <Link to="/" className="floating-card__back">
            <i className="bi bi-arrow-left" />
          </Link>
          <h1 className="floating-card__title">LEPA</h1>
          <button className="btn-nueva-tarea" onClick={() => setShowNueva(true)}>+</button>
        </header>

        <div className="floating-card__body">
          {cargando ? (
            <p className="text-muted text-center mt-4">Cargando...</p>
          ) : tareasPendientes.length === 0 ? (
            <p className="text-muted text-center mt-4">No hay tareas pendientes.</p>
          ) : (
            <ul className="tareas-lista">
              {tareasPendientes.map((t) => (
                <TareaCard
                  key={t._id}
                  tarea={t}
                  onClick={(t) => setTareaEditar(t)}
                />
              ))}
            </ul>
          )}
        </div>

      </div>

      <ModalTarea
        show={showNueva}
        onClose={() => setShowNueva(false)}
        onGuardar={handleGuardar}
        seccion="lepa"
        accentClass="btn-accent-lepa"
      />

      <ModalTarea
        show={!!tareaEditar}
        onClose={() => setTareaEditar(null)}
        onGuardar={handleGuardar}
        onBorrar={handleBorrar}
        onToggleEstado={handleCompletar}
        seccion="lepa"
        accentClass="btn-accent-lepa"
        tareaInicial={tareaEditar}
      />

      <ModalVerTarea
        tarea={tareaVer}
        onClose={() => setTareaVer(null)}
      />

      <Toast mensaje={toast} onOcultar={() => setToast(null)} />
    </div>
  );
}
