"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function Modal({ open, onClose, title, children }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
