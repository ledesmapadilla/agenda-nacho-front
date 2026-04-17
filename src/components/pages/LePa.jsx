import { useState } from "react";
import { Link } from "react-router-dom";
import ModalTarea from "../shared/ModalTarea";
import ModalVerTarea from "../shared/ModalVerTarea";
import TareaCard from "../shared/TareaCard";

const MOCK = [
  { _id: "1", fecha: "2026-04-16", descripcion: "Revisar presupuesto mensual y ajustar partidas según los gastos reales del trimestre.", urgencia: "alta", responsable: "Nacho", completado: false },
  { _id: "2", fecha: "2026-04-18", descripcion: "Coordinar reunión con proveedores para cierre de contrato anual.", urgencia: "baja", responsable: "Nelson", completado: false },
  { _id: "3", fecha: "2026-04-20", descripcion: "Actualizar planilla de asistencia del personal operativo.", urgencia: "baja", responsable: "Zamorano", completado: true },
];

export default function LePa() {
  const [tareas, setTareas]           = useState(MOCK);
  const [showNueva, setShowNueva]     = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);
  const [tareaVer, setTareaVer]       = useState(null);

  const handleGuardar = (data) => {
    if (data._id) {
      setTareas((prev) => prev.map((t) => (t._id === data._id ? { ...t, ...data } : t)));
    } else {
      setTareas((prev) => [...prev, { ...data, _id: Date.now().toString(), completado: false }]);
    }
  };

  const handleCompletar = (id) => {
    setTareas((prev) => prev.filter((t) => t._id !== id));
  };

  const handleBorrar = (id) => {
    setTareas((prev) => prev.filter((t) => t._id !== id));
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
          {tareasPendientes.length === 0 ? (
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
    </div>
  );
}
