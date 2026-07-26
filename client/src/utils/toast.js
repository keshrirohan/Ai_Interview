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
