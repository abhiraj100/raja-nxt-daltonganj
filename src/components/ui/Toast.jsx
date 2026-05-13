// src/components/ui/Toast.jsx
import React from "react";
import { CheckCircle, XCircle, Info, AlertCircle, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const TOAST_STYLES = {
  success: {
    bg: "bg-stone-900",
    icon: <CheckCircle size={16} className="text-emerald-400" />,
  },
  error: {
    bg: "bg-stone-900",
    icon: <XCircle size={16} className="text-rose-400" />,
  },
  info: {
    bg: "bg-stone-900",
    icon: <Info size={16} className="text-sky-400" />,
  },
  warning: {
    bg: "bg-stone-900",
    icon: <AlertCircle size={16} className="text-amber-400" />,
  },
};

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
      <div className={`${style.bg} text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[240px] max-w-sm`}>
        {style.icon}
        <span className="text-sm font-medium flex-1">{toast.msg}</span>
      </div>
    </div>
  );
}
