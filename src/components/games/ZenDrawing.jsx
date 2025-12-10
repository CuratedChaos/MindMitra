import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Palette } from 'lucide-react';

export default function ZenDrawing() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8B5CF6');
  const [brushSize, setBrushSize] = useState(5);
  const [score, setScore] = useState(0);

  const colors = [
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Orange', hex: '#F59E0B' },
    { name: 'Red', hex: '#EF4444' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setScore(score + 1);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'zen-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Mindful Strokes</p>
          <p className="text-3xl font-bold text-purple-600">{score}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={clearCanvas} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={downloadDrawing} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Choose Color:</p>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${
                  color === c.hex ? 'scale-110 ring-4 ring-purple-300' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Brush Size: {brushSize}px</p>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="relative bg-white rounded-xl shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <p className="text-sm text-gray-700 text-center">
          🎨 <strong>Zen Drawing:</strong> Let your creativity flow. Focus on the present moment and create beautiful patterns!
        </p>
      </div>
    </div>
  );
}