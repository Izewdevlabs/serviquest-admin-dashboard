import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = "Modal Title",
  children,
  variant = "default", // "default" | "confirm" | "danger"
  confirmText = "Confirm",
  cancelText = "Cancel",
  showActions = false, // whether to show footer buttons
}) {
  // 🔹 Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 🔹 Variant colors
  const variantClasses = {
    default: {
      header: "text-gray-800 dark:text-gray-100",
      confirm:
        "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800",
    },
    confirm: {
      header: "text-blue-700 dark:text-blue-400",
      confirm:
        "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800",
    },
    danger: {
      header: "text-red-600 dark:text-red-400",
      confirm:
        "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800",
    },
  };

  const current = variantClasses[variant] || variantClasses.default;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[90%] max-w-lg p-6 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-lg font-semibold ${current.header} tracking-wide`}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
              >
                ✖
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {children}
            </div>

            {/* Footer Actions */}
            {showActions && (
              <div className="mt-6 flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-md font-medium ${current.confirm}`}
                >
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
