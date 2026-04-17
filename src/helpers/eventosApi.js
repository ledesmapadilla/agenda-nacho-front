const BASE = import.meta.env.VITE_API_URL || "https://agenda-back-ten.vercel.app/api";

export const getEventos = (seccion) =>
  fetch(`${BASE}/eventos/${seccion}`).then((r) => r.json());

export const createEvento = (seccion, data) =>
  fetch(`${BASE}/eventos/${seccion}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateEvento = (id, data) =>
  fetch(`${BASE}/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteEvento = (id) =>
  fetch(`${BASE}/eventos/${id}`, { method: "DELETE" }).then((r) => r.json());
