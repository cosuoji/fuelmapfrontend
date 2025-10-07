// src/components/AddToHomeScreenPrompt.jsx
import { useEffect, useState } from "react";

const AddToHomeScreenPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAddClick = async () => {
    setVisible(false);
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    }
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border shadow-lg p-4 rounded-2xl text-center z-50">
      <p className="text-gray-800 font-medium mb-2">
        Install Fuel Price Directory on your home screen for quick access!
      </p>
      <button
        onClick={handleAddClick}
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        Add to Home Screen
      </button>
    </div>
  );
};

export default AddToHomeScreenPrompt;
