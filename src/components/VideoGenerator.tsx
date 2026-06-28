import React, { useState, useRef, useEffect } from 'react';
import { Upload, Video, Loader, Play, Sparkles, Download } from 'lucide-react';

export default function VideoGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [effect, setEffect] = useState<'kenburns' | 'pulse' | 'glitch'>('kenburns');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
    };
    img.src = url;
  };

  const startRecording = async () => {
    if (!imageObj || !canvasRef.current) return;
    
    setIsGenerating(true);
    setVideoUrl(null);
    setStatusText('Animando e gravando vídeo (5s)...');

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to 720p or aspect ratio of image
    const aspectRatio = imageObj.width / imageObj.height;
    canvas.width = 1280;
    canvas.height = 1280 / aspectRatio;

    // Start rendering loop
    let startTime = performance.now();
    let animationFrameId: number;
    const duration = 5000; // 5 seconds recording

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (effect === 'kenburns') {
        // Zoom and pan
        const scale = 1 + (progress * 0.2); // 1 to 1.2
        const panX = -canvas.width * (scale - 1) * 0.5 * progress;
        const panY = -canvas.height * (scale - 1) * 0.5 * progress;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else if (effect === 'pulse') {
        // Pulse scaling
        const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // Add neon overlay
        ctx.fillStyle = `rgba(0, 239, 255, ${Math.sin(progress * Math.PI * 4) * 0.2})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (effect === 'glitch') {
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        
        // Random glitch slices
        if (Math.random() > 0.7) {
          for (let i = 0; i < 5; i++) {
            const sy = Math.random() * imageObj.height;
            const sh = Math.random() * 50;
            const dy = (sy / imageObj.height) * canvas.height;
            const dh = (sh / imageObj.height) * canvas.height;
            const dx = (Math.random() - 0.5) * 40;
            
            ctx.drawImage(imageObj, 0, sy, imageObj.width, sh, dx, dy, canvas.width, dh);
          }
          
          // Color shift
          ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Add watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('⚡ TelePulse', 40, canvas.height - 40);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    // Setup MediaRecorder
    try {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setIsGenerating(false);
        setStatusText('');
        cancelAnimationFrame(animationFrameId);
        
        // Clear canvas to save memory visually if wanted, but keeping last frame is fine.
      };

      mediaRecorder.start();
      
      // Stop after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, duration);

    } catch (err) {
      console.error(err);
      alert('Seu navegador não suporta a gravação de vídeo pelo Canvas (MediaRecorder). Tente no Chrome.');
      setIsGenerating(false);
      cancelAnimationFrame(animationFrameId);
    }
  };

  return (
    <div className="bg-[#1A1F2E] border border-white/5 rounded-3xl p-8 shadow-2xl mt-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Sparkles className="text-[#00efff]" /> 
        TelePulse Animador PRO (Grátis)
      </h2>
      <p className="text-gray-400 mb-8">
        Anime suas imagens promocionais diretamente no seu navegador, sem custo de APIs. Crie conteúdos virais em segundos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0088cc]/50 transition-colors h-64 bg-white/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-lg" />
            ) : (
              <>
                <Upload size={48} className="text-gray-500 mb-4" />
                <p className="font-bold mb-2">Clique para enviar imagem</p>
                <p className="text-sm text-gray-500">Qualquer tamanho suportado</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-gray-300">Escolha o Efeito</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setEffect('kenburns')}
                className={`p-3 rounded-xl font-bold text-sm transition-all border ${effect === 'kenburns' ? 'bg-[#0088cc]/20 border-[#0088cc] text-white' : 'bg-[#0F1419] border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                Ken Burns
              </button>
              <button 
                onClick={() => setEffect('pulse')}
                className={`p-3 rounded-xl font-bold text-sm transition-all border ${effect === 'pulse' ? 'bg-[#A855F7]/20 border-[#A855F7] text-white' : 'bg-[#0F1419] border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                Pulse Neon
              </button>
              <button 
                onClick={() => setEffect('glitch')}
                className={`p-3 rounded-xl font-bold text-sm transition-all border ${effect === 'glitch' ? 'bg-[#FF6B6B]/20 border-[#FF6B6B] text-white' : 'bg-[#0F1419] border-white/10 text-gray-400 hover:bg-white/5'}`}
              >
                Cyber Glitch
              </button>
            </div>
          </div>

          <button 
            onClick={startRecording}
            disabled={!imageObj || isGenerating}
            className="w-full bg-gradient-to-r from-[#0088cc] to-[#a855f7] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Loader className="animate-spin" /> {statusText}</>
            ) : (
              <><Play size={20} /> Gerar Vídeo</>
            )}
          </button>
        </div>

        <div className="bg-[#0F1419] rounded-2xl border border-white/5 flex flex-col items-center justify-center h-full min-h-[300px] p-4 relative overflow-hidden">
          {/* Hidden Canvas for rendering */}
          <canvas ref={canvasRef} className="hidden" />
          
          {isGenerating ? (
            <div className="text-center text-white flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin" />
              <p className="animate-pulse">{statusText}</p>
            </div>
          ) : videoUrl ? (
            <div className="w-full h-full flex flex-col gap-4">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop
                className="w-full h-full object-contain rounded-xl flex-1"
              />
              <a 
                href={videoUrl}
                download={`telepulse-${effect}.webm`}
                className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={18} /> Baixar Vídeo (WebM)
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500 flex flex-col items-center gap-3">
              <Video size={48} className="opacity-20" />
              <p>O vídeo gerado aparecerá aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

