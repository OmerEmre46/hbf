import React, { useState, useEffect, useRef } from 'react';
import { StoryScript, StoryScene, VideoClipSequence } from '../../types/football';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Film,
  Layers,
  Sparkles,
  Check,
  FileCode,
  FileText,
  Sliders,
  Scissors,
  Eye,
  Radio,
} from 'lucide-react';

interface VideoComposerModuleProps {
  script: StoryScript;
  clipSequence: VideoClipSequence;
}

export const VideoComposerModule: React.FC<VideoComposerModuleProps> = ({
  script,
  clipSequence,
}) => {
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [speechActive, setSpeechActive] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const totalDuration = script.scenes.reduce((acc, s) => Math.max(acc, s.endSec), 105);

  // Find active scene
  const activeScene: StoryScene =
    script.scenes.find((s) => currentTimeSec >= s.startSec && currentTimeSec < s.endSec) ||
    script.scenes[0];

  // Playback timer loop
  useEffect(() => {
    let animFrame: number;
    let lastTick = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTick) / 1000;
        lastTick = now;

        setCurrentTimeSec((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animFrame = requestAnimationFrame(loop);
      }
    };

    if (isPlaying) {
      lastTick = performance.now();
      animFrame = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Web Speech API Voiceover Preview
  const handleTestVoiceover = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speechActive) {
        setSpeechActive(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.95; // Slightly slower, more deliberate HBF tone
      utterance.pitch = 0.9; // Deeper tone
      utterance.onend = () => setSpeechActive(false);
      utterance.onerror = () => setSpeechActive(false);
      setSpeechActive(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tarayıcınız Web Speech API seslendirmesini desteklemiyor.');
    }
  };

  const handleExportJson = () => {
    const exportData = {
      project: 'TacticalVision AI - Automated Football Content Production',
      script: script,
      clipSequence: clipSequence,
      ffmpegRenderDirectives: script.scenes.map((s, idx) => ({
        sceneNumber: s.sceneNumber,
        inPointSec: s.startSec,
        outPointSec: s.endSec,
        durationSec: s.durationSec,
        sourceClip: `raw_match_footage_cam1_${s.recommendedClipPhase.toLowerCase().replace(/\s+/g, '_')}.mp4`,
        overlays: [
          { type: 'telestration_canvas', directive: s.telestrationDirective },
          { type: 'lower_third_hud', text: s.statsCallout },
        ],
        audioTrack: {
          ttsAudioFile: `voiceover_scene_${idx + 1}.wav`,
          bgMusic: 'cinematic_tactical_tension_loop.mp3',
          bgVolume: 0.18,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tactical_video_composer_cuesheet_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('FFmpeg ve MoviePy uyumlu kurgu direktifleri (.JSON) başarıyla indirildi!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportMarkdown = () => {
    let md = `# ${script.title}\n`;
    md += `## ${script.subtitle}\n\n`;
    md += `**Üslup:** ${script.authorStyle}\n`;
    md += `**Kanca:** "${script.hookTitle}"\n\n`;
    md += `### Taktiksel Hipotez\n${script.tacticalThesis}\n\n`;
    md += `### Sahne Sahne Kurgu ve Seslendirme Dökümü\n\n`;

    script.scenes.forEach((s) => {
      md += `#### Sahne ${s.sceneNumber}: ${s.title} (${s.startSec}s - ${s.endSec}s)\n`;
      md += `- **Ses Tonu:** [${s.narrativeTone}]\n`;
      md += `- **Seslendirme Metni:**\n> "${s.voiceoverText}"\n`;
      md += `- **Görsel Yönetim:** ${s.visualDirection}\n`;
      md += `- **Telestrasyon Grafiği:** ${s.telestrationDirective}\n`;
      md += `- **Veri HUD:** ${s.statsCallout || 'N/A'}\n\n`;
    });

    if (script.youtubeMetadata) {
      md += `### YouTube SEO Paketi\n`;
      md += `**Önerilen Başlıklar:**\n${script.youtubeMetadata.videoTitleCandidates.map((t) => `- ${t}`).join('\n')}\n\n`;
      md += `**Açıklama:**\n\`\`\`\n${script.youtubeMetadata.descriptionWithTimestamps}\n\`\`\`\n\n`;
      md += `**Thumbnail Prompt:**\n${script.youtubeMetadata.thumbnailPrompt}\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HBF_Senaryo_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Tam seslendirme ve kurgu senaryosu (.MD) başarıyla indirildi!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              MODÜL 4 / 4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Otomatik Kurgu, Telestrasyon ve Çok Kanallı Render Stüdyosu
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Video görüntüleri, otomatik taktik katmanları, seslendirme dalga formu ve altyazı teleprompter'ı senkronize olarak birleştirilir.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Senaryoyu İndir (.MD)</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:translate-x-0.5"
          >
            <Download className="w-4 h-4" />
            <span>FFmpeg Kurgu Paketini İndir</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rendered Video Viewport & Prompter (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Viewport Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/90 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white">NİHAİ KURGU ÖNİZLEME (1080p 60FPS)</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-amber-400 font-bold">{formatTime(currentTimeSec)}</span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-[16/9] bg-gradient-to-b from-slate-950 via-[#07170e] to-slate-950 overflow-hidden select-none">
              {/* Pitch Ambience Visual */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3)_0,transparent_75%)]" />

              {/* Watermark Logo */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 text-xs font-black tracking-widest text-amber-400 uppercase">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>HASTALIK BU FUTBOL ANALİZ</span>
              </div>

              {/* Cinematic Center Visual */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                {/* Active Scene Phase Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3 shadow-lg">
                  Sahne {activeScene.sceneNumber}: {activeScene.title}
                </span>

                {/* Animated Telestration Graphic Directives on Screen */}
                <div className="max-w-lg bg-slate-950/85 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Telestrasyon Katmanı (Otomatik Çizildi)</span>
                    </span>
                    <span className="text-amber-400 font-bold">[{activeScene.narrativeTone}]</span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {activeScene.telestrationDirective}
                  </p>
                </div>
              </div>

              {/* Lower Third HUD: Key Stat Callout */}
              {activeScene.statsCallout && (
                <div className="absolute bottom-16 right-4 bg-emerald-950/90 border border-emerald-500/40 px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fadeIn">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Kritik Taktik Veri</span>
                    <span className="text-xs font-bold text-white font-mono">{activeScene.statsCallout}</span>
                  </div>
                </div>
              )}

              {/* Subtitle Teleprompter Bar */}
              <div className="absolute bottom-2 inset-x-4 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-center">
                <p className="text-xs font-medium text-amber-200 line-clamp-2 leading-relaxed">
                  "{activeScene.voiceoverText}"
                </p>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setCurrentTimeSec(0)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Başa Al"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Web Speech Voiceover Test */}
                <button
                  onClick={() => handleTestVoiceover(activeScene.voiceoverText)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    speechActive
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Sahne seslendirmesini canlı test et"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speechActive ? 'Ses Çalıyor...' : 'Seslendirmeyi Dinle (TTS)'}</span>
                </button>
              </div>

              {/* Playback Speed Controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Hız:</span>
                {[0.5, 1, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Track Interactive Timeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-400" />
                <span>Çok Kanallı Kurgu Zaman Çizelgesi (Multi-Track Timeline)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                İmleç: {formatTime(currentTimeSec)}
              </span>
            </div>

            {/* Timeline Scrubber Track */}
            <div className="relative pt-2">
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.5}
                value={currentTimeSec}
                onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              {/* Visual Scene Blocks on Timeline */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {script.scenes.map((scene, i) => {
                  const isActive = currentTimeSec >= scene.startSec && currentTimeSec < scene.endSec;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentTimeSec(scene.startSec)}
                      className={`p-2 rounded-lg text-left border transition-all text-xs ${
                        isActive
                          ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold">S#{scene.sceneNumber}</span>
                        <span>{scene.durationSec}s</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-200 truncate mt-1">
                        {scene.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Teleprompter & Director Cue Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Yönetmen ve Seslendirmen Masası</span>
            </div>

            {/* Current Active Scene Prompter */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">
                  AKTİF SAHNE #{activeScene.sceneNumber}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {activeScene.narrativeTone}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeScene.voiceoverText}
              </p>
            </div>

            {/* Visual Direction Notes */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Kamera & Klip Talimatı</span>
              <p className="text-slate-300 text-xs">{activeScene.visualDirection}</p>
            </div>

            {/* Python / FFmpeg Automation Code Snippet */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-mono text-sky-400 font-bold block">
                Arka Plan FFmpeg Kurgu Komutu (Python CLI)
              </span>
              <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto p-2 bg-slate-900 rounded-lg">
{`# Otomatik render pipeline çağrısı
python -m services.video_composer.render_pipeline \\
  --scene ${activeScene.sceneNumber} \\
  --in ${activeScene.startSec} --out ${activeScene.endSec} \\
  --filter_telestration "${activeScene.telestrationDirective.slice(0, 28)}..." \\
  --hud_metric "${activeScene.statsCallout || 'xG'}" \\
  --voiceover_wav voice_${activeScene.sceneNumber}.wav \\
  --output scene_${activeScene.sceneNumber}_final.mp4`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
