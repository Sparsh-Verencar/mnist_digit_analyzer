"use client";
import { useRef, useState, useEffect } from "react";

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null); // store predicted number

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Drawing functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => setIsDrawing(false);

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 10, 10); // blocky pixels
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  // Save + send to FastAPI
  const saveDrawing = async () => {
    const canvas = canvasRef.current;

    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.drawImage(canvas, 0, 0, 28, 28);

    const imageData = smallCanvas.toDataURL("image/png");

    // Send to backend
    try {
      const response = await fetch("https://mnist-backend-ju5b.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const result = await response.json();
      setPrediction(result.prediction); // set state
    } catch (err) {
      console.error("Error:", err);
      setPrediction("Error connecting to backend");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />

      <div className="space-x-4">
        <button onClick={clearCanvas} className="px-4 py-2 bg-gray-300 rounded">
          Clear
        </button>
        <button onClick={saveDrawing} className="px-4 py-2 bg-blue-500 text-white rounded">
          Predict
        </button>
      </div>

      {prediction !== null && (
        <div className="mt-4 text-2xl font-bold">
          Predicted Number: {prediction}
        </div>
      )}
    </div>
  );
}
