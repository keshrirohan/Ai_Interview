const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const createSpeechRecognition = () => {
  if (!SpeechRecognition) {
    throw new Error("Speech Recognition is not supported.");
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  return recognition;
};
