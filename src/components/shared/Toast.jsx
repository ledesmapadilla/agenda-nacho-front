import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#666666",
  border: "2px solid #f0c040",
  color: "#fff",
  padding: "18px 36px",
  borderRadius: "24px",
  fontSize: "1.1rem",
  fontWeight: "700",
  whiteSpace: "nowrap",
  zIndex: 99999,
  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
};

export default function Toast({ mensaje, onOcultar }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!mensaje) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onOcultar, 2200);
    return () => clearTimeout(timerRef.current);
  }, [mensaje]);

  if (!mensaje) return null;

  return createPortal(
    <div style={style}>{mensaje}</div>,
    document.body
  );
}
