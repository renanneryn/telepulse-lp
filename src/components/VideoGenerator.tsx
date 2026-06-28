import React, { useState, useRef } from 'react';
import { Upload, Video, Loader, Play } from 'lucide-react';

export default function VideoGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      
      // Extract base64 without prefix
      const base64 = result.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageBase64) return;
    
    setIsGenerating(true);
    setVideoUrl(null);
    setStatusText('Iniciando geração do vídeo com a IA...');

    try {
      // 1. Start operation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBytes: imageBase64, mimeType, prompt })
      });
      
      if (!startRes.ok) throw new Error("Falha ao iniciar geração");
      
      const { operationName } = await startRes.json();
      setStatusText('Gerando vídeo... Isso pode levar alguns minutos.');

      // 2. Poll for status
      let isDone = false;
      while (!isDone) {
        await new Promise(r => setTimeout(r, 10000)); // Poll every 10s
        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName })
        });
        
        if (!statusRes.ok) throw new Error("Falha ao verificar status");
        const statusData = await statusRes.json();
        
        if (statusData.done) {
          isDone = true;
        } else {
          setStatusText('Ainda gerando... A IA está criando os frames.');
        }
      }
      
      setStatusText('Finalizando e baixando vídeo...');

      // 3. Download video
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName })
      });
      
      if (!downloadRes.ok) throw new Error("Falha ao baixar vídeo");
      
      const blob = await downloadRes.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
      setStatusText('');
    }
  };

  return (
    <div className="bg-[#1A1F2E] border border-white/5 rounded-3xl p-8 shadow-2xl mt-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Video className="text-[#00efff]" /> 
        TelePulse Video Studio
      </h2>
      <p className="text-gray-400 mb-8">
        Anime suas imagens promocionais usando o poder do Google Veo. Crie conteúdos virais em segundos.
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
                <p className="text-sm text-gray-500">Recomendado 16:9 ou 9:16</p>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-300">Prompt (Opcional)</label>
            <input 
              type="text" 
              placeholder="Descreva o movimento desejado..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#0F1419] border border-white/10 rounded-xl p-4 text-white focus:border-[#0088cc] outline-none transition-colors"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!imageBase64 || isGenerating}
            className="w-full bg-gradient-to-r from-[#0088cc] to-[#a855f7] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Loader className="animate-spin" /> {statusText || 'Gerando...'}</>
            ) : (
              <><Play size={20} /> Animar Imagem</>
            )}
          </button>
        </div>

        <div className="bg-[#0F1419] rounded-2xl border border-white/5 flex flex-col items-center justify-center h-full min-h-[300px] p-4">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop
              className="w-full h-full object-contain rounded-xl"
            />
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
