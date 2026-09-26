import React, { useState } from 'react';
import { MatchData, StoryScript, StoryScene } from '../../types/football';
import { generateTacticalStory } from '../../services/geminiService';
import {
  Sparkles,
  BookOpen,
  Send,
  RefreshCw,
  Video,
  Youtube,
  Edit3,
  Copy,
  Check,
  ChevronRight,
  Flame,
  Volume2,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface StorytellingModuleProps {
  matchData: MatchData;
  script: StoryScript;
  onUpdateScript: (script: StoryScript) => void;
  onProceedToComposer: () => void;
}

export const StorytellingModule: React.FC<StorytellingModuleProps> = ({
  matchData,
  script,
  onUpdateScript,
  onProceedToComposer,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [focusTopic, setFocusTopic] = useState<string>('Düşük blok ve Rüdiger-Haaland kafesi');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorNotice(null);
    setStatusMessage('Gemini 3.8 Flash "Hastalık Bu Futbol" taktiksel hikayesini kaleme alıyor...');
    try {
      const response = await generateTacticalStory({
        matchData,
        focusTopic,
        customNotes,
      });

      if (response && response.script) {
        onUpdateScript(response.script);
        setStatusMessage(
          response.notice ||
            `Senaryo başarıyla oluşturuldu! (Model: ${response.source || 'gemini-3.8-flash'})`
        );
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'Senaryo oluşturulurken bir problem meydana geldi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSceneTextChange = (idx: number, newText: string) => {
    const updatedScenes = [...script.scenes];
    updatedScenes[idx] = { ...updatedScenes[idx], voiceoverText: newText };
    onUpdateScript({ ...script, scenes: updatedScenes });
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              MODÜL 3 / 4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Senaryo ve "Hastalık Bu Futbol" Hikaye Anlatımı (LLM Engine)
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gemini 3.8 Flash ile ham veriler dramatik, sinematik, analitik ve felsefi bir YouTube video senaryosuna dönüştürülür.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onProceedToComposer}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:translate-x-0.5"
          >
            <span>Otomatik Kurgu Modülüne Aktar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Generation Config Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Yapay Zeka Taktik Senaristi Ayarları</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Odak Taktik Konusu</label>
            <input
              type="text"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              placeholder="Örn: Rüdiger'in Haaland kafesi ve düşük blok disiplini"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Ekstra Yönetmen Notu / Vurgu</label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Örn: Girişte Guardiola'nın yüz ifadesine ve acı çeken stadyuma vurgu yap"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-950/40 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Yazılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Yeniden Üret</span>
                </>
              )}
            </button>
          </div>
        </div>

        {statusMessage && (
          <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl mt-3 animate-fadeIn">
            {statusMessage}
          </p>
        )}

        {errorNotice && (
          <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl mt-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}
      </div>

      {/* Script Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 font-mono">
                {script.authorStyle.toUpperCase()} STİLİ
              </span>
              <span className="text-xs text-slate-400">Toplam Süre: ~105 sn</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">{script.title}</h3>
            <p className="text-xs text-amber-400/90 font-medium italic mt-0.5">"{script.hookTitle}"</p>
          </div>

          <button
            onClick={() => copyToClipboard(JSON.stringify(script, null, 2), 'all_script')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors shrink-0"
          >
            {copiedField === 'all_script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Senaryoyu Kopyala (JSON)</span>
          </button>
        </div>

        {/* Narrative Summary & Thesis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Taktiksel Hipotez</span>
            <p className="text-xs text-slate-300 leading-relaxed">{script.tacticalThesis}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Anlatı Özeti</span>
            <p className="text-xs text-slate-300 leading-relaxed">{script.narrativeSummary}</p>
          </div>
        </div>

        {/* Scene by Scene Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Sahne Sahne Video & Seslendirme Akışı</span>
            </h4>
            <span className="text-xs text-slate-500">Metin kutularına tıklayarak seslendirmeyi düzenleyebilirsiniz</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {script.scenes.map((scene: StoryScene, idx: number) => {
              const toneColors: Record<string, string> = {
                'Dramatik': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                'Analitik': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                'Yüksek Tempolu': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                'Fısıltı & Gizem': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                'Felsefi Kapanış': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              };

              return (
                <div
                  key={scene.id || idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all space-y-3"
                >
                  {/* Scene Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center font-mono">
                        {scene.sceneNumber}
                      </span>
                      <span className="text-sm font-bold text-white">{scene.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${toneColors[scene.narrativeTone] || 'bg-slate-800 text-slate-300'}`}>
                        {scene.narrativeTone}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {scene.startSec}s - {scene.endSec}s ({scene.durationSec} sn)
                      </span>
                    </div>
                  </div>

                  {/* Voiceover Script with Edit Ability */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase mb-1">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Seslendirme Metni (Voiceover Narration)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={scene.voiceoverText}
                      onChange={(e) => handleSceneTextChange(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-amber-500/60 resize-y"
                    />
                  </div>

                  {/* Visual & Telestration Directives */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Görsel Yönetmenlik</span>
                      <p className="text-slate-300 text-[11px] leading-snug">{scene.visualDirection}</p>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-amber-400/90 uppercase font-bold block mb-0.5">Otomatik Telestrasyon Çizimi</span>
                      <p className="text-slate-300 text-[11px] leading-snug">{scene.telestrationDirective}</p>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-0.5">Ekrana Basılacak Veri (HUD)</span>
                      <p className="text-emerald-300 font-mono text-[11px] font-bold">{scene.statsCallout || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* YouTube Publishing Package */}
        {script.youtubeMetadata && (
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Youtube className="w-5 h-5 text-rose-500" />
              <span>YouTube Yayın ve SEO Paketi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Alternatif Tıklanma (CTR) Başlıkları</span>
                <div className="space-y-1.5">
                  {script.youtubeMetadata.videoTitleCandidates.map((title, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-900 rounded-lg text-slate-200">
                      <span>{title}</span>
                      <button
                        onClick={() => copyToClipboard(title, `title-${i}`)}
                        className="text-slate-400 hover:text-white ml-2 shrink-0"
                      >
                        {copiedField === `title-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Thumbnail (Küçük Resim) Yapay Zeka Promptu</span>
                <p className="text-slate-300 text-xs italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  "{script.youtubeMetadata.thumbnailPrompt}"
                </p>
                <button
                  onClick={() => copyToClipboard(script.youtubeMetadata.thumbnailPrompt, 'thumb_prompt')}
                  className="mt-2 text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  {copiedField === 'thumb_prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Promptu Kopyala</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
