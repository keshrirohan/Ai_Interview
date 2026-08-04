/**
 * toast.js
 *
 * Thin wrappers around react-hot-toast with consistent styling.
 * Import these instead of calling toast() directly so toast appearance
 * is controlled from one place.
 *
 * Exports:
 *   successToast(message) — green toast for successful actions
 *   errorToast(message)   — red toast for errors and validation failures
 *   loadingToast(message) — blue toast for in-progress operations
 */

import toast from "react-hot-toast";

export const successToast = (message) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#4CAF50",
      color: "#fff",
    },
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#F44336",
      color: "#fff",
    },
  });
};

export const loadingToast = (message) => {
  toast.loading(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#2196F3",
      color: "#fff",
    },
  });
};
