import React, { useState } from 'react';
import { SAMPLE_MATCHES, SAMPLE_CLIP_SEQUENCE, INITIAL_HBF_SCRIPT } from './data/sampleMatches';
import { MatchData, StoryScript, VideoClipSequence } from './types/football';
import { Navbar, ActiveModule } from './components/Navbar';
import { DataEngineModule } from './components/modules/DataEngineModule';
import { VisionTrackingModule } from './components/modules/VisionTrackingModule';
import { StorytellingModule } from './components/modules/StorytellingModule';
import { VideoComposerModule } from './components/modules/VideoComposerModule';
import { ArchitectureDocsModule } from './components/modules/ArchitectureDocsModule';
import { Flame, Sparkles, Youtube, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('data_engine');
  const [selectedMatch, setSelectedMatch] = useState<MatchData>(SAMPLE_MATCHES[0]);
  const [script, setScript] = useState<StoryScript>(INITIAL_HBF_SCRIPT);
  const [clipSequence, setClipSequence] = useState<VideoClipSequence>(SAMPLE_CLIP_SEQUENCE);

  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        matchTitle={selectedMatch.title}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === 'data_engine' && (
          <DataEngineModule
            matches={SAMPLE_MATCHES}
            selectedMatch={selectedMatch}
            onSelectMatch={setSelectedMatch}
            onProceedToStorytelling={() => setActiveModule('storytelling')}
          />
        )}

        {activeModule === 'vision_tracking' && (
          <VisionTrackingModule
            clipSequence={clipSequence}
            onProceedToStorytelling={() => setActiveModule('storytelling')}
          />
        )}

        {activeModule === 'storytelling' && (
          <StorytellingModule
            matchData={selectedMatch}
            script={script}
            onUpdateScript={setScript}
            onProceedToComposer={() => setActiveModule('video_composer')}
          />
        )}

        {activeModule === 'video_composer' && (
          <VideoComposerModule
            script={script}
            clipSequence={clipSequence}
          />
        )}

        {activeModule === 'architecture' && (
          <ArchitectureDocsModule />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">TacticalVision AI</span>
            <span>•</span>
            <span>"Hastalık Bu Futbol" Uçtan Uca Yapay Zeka İçerik Üretim Stüdyosu</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-emerald-500/90">Event-Driven Architecture</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-amber-500/90">Gemini 3.8 Flash LLM</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-sky-500/90">YOLOv11 CV Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
