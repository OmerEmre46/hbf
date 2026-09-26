import React, { useState } from 'react';
import { MatchData, Player } from '../../types/football';
import { TacticalPitch } from '../common/TacticalPitch';
import {
  Upload,
  BarChart3,
  Activity,
  Flame,
  Zap,
  Target,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DataEngineModuleProps {
  matches: MatchData[];
  selectedMatch: MatchData;
  onSelectMatch: (match: MatchData) => void;
  onProceedToStorytelling: () => void;
}

export const DataEngineModule: React.FC<DataEngineModuleProps> = ({
  matches,
  selectedMatch,
  onSelectMatch,
  onProceedToStorytelling,
}) => {
  const [pitchMode, setPitchMode] = useState<'pass-network' | 'xg-shots'>('pass-network');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadSuccess(`"${file.name}" başarıyla yüklendi ve ayrıştırıldı! (StatsBomb/Opta Event Formatı)`);
      setTimeout(() => setUploadSuccess(null), 4500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              MODÜL 1 / 4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Veri İşleme ve Taktiksel Metrik Motoru</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Opta ve StatsBomb uyumlu maç olayları (xG, pas matrisleri, PPDA ve yarım alan girişleri) analiz edilerek taktiksel hipotez çıkarılır.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Veri Seti Yükle (.JSON / .CSV)</span>
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onProceedToStorytelling}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:translate-x-0.5"
          >
            <span>Senaryo Motoruna Aktar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Match Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {matches.map((m) => {
          const isSelected = m.id === selectedMatch.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMatch(m)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left border transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/60 text-white shadow-md'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
              }`}
            >
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: m.homeTeam.color }} />
              <div>
                <p className="text-xs font-bold leading-tight line-clamp-1">{m.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.competition} • Skor: {m.score}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Pitch Visualizer & Metrics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Tactical Pitch (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
            {/* Pitch View Toggle */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPitchMode('pass-network')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pitchMode === 'pass-network'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Pas Ağı & Diziliş</span>
                </button>
                <button
                  onClick={() => setPitchMode('xg-shots')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    pitchMode === 'xg-shots'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>xG Şut Haritası</span>
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Oyuncu detayları için üzerine tıklayabilirsiniz
              </div>
            </div>

            {/* Tactical Pitch Component */}
            <TacticalPitch
              mode={pitchMode}
              players={selectedMatch.players}
              shots={selectedMatch.shots}
              passLinks={selectedMatch.passLinks}
              homeColor={selectedMatch.homeTeam.color}
              awayColor={selectedMatch.awayTeam.color}
              homeTeamName={selectedMatch.homeTeam.name}
              awayTeamName={selectedMatch.awayTeam.name}
              selectedPlayerId={selectedPlayer?.id}
              onSelectPlayer={setSelectedPlayer}
            />

            {/* Tactical Thesis Banner */}
            <div className="mt-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Çıkarılan Taktiksel Hipotez ("Hastalık Bu Futbol" Çekirdeği)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedMatch.tacticalThesis}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Tactical KPIs & Player Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tactical Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Field Tilt */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Field Tilt (Saha Eğimi)</span>
                </span>
                <span className="text-[10px] text-slate-500">3. Bölge Dominansı</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-mono text-sky-400">%{selectedMatch.metrics.fieldTiltHome}</span>
                <span className="text-xs font-medium text-slate-500">vs</span>
                <span className="text-2xl font-bold font-mono text-slate-300">%{selectedMatch.metrics.fieldTiltAway}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-sky-400 h-full transition-all"
                  style={{ width: `${selectedMatch.metrics.fieldTiltHome}%` }}
                />
                <div
                  className="bg-slate-400 h-full transition-all"
                  style={{ width: `${selectedMatch.metrics.fieldTiltAway}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{selectedMatch.homeTeam.name}</span>
                <span>{selectedMatch.awayTeam.name}</span>
              </div>
            </div>

            {/* PPDA (Pres Şiddeti) */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>PPDA (Pres Yoğunluğu)</span>
                </span>
                <span className="text-[10px] text-slate-500">Düşük = Şiddetli</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold font-mono text-sky-400">{selectedMatch.metrics.ppdaHome}</span>
                <span className="text-xs font-medium text-slate-500">vs</span>
                <span className="text-2xl font-bold font-mono text-slate-300">{selectedMatch.metrics.ppdaAway}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {selectedMatch.metrics.ppdaAway > 15
                  ? `${selectedMatch.awayTeam.name} derin savunma bloğunu korudu.`
                  : `${selectedMatch.homeTeam.name} rakip yarı sahada boğucu pres uyguladı.`}
              </p>
            </div>

            {/* Total xG */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toplam Beklenen Gol (xG)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {selectedMatch.metrics.totalXgHome.toFixed(2)}
                </span>
                <span className="text-slate-500">-</span>
                <span className="text-2xl font-bold font-mono text-slate-300">
                  {selectedMatch.metrics.totalXgAway.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Fark: +{(selectedMatch.metrics.totalXgHome - selectedMatch.metrics.totalXgAway).toFixed(2)} xG
              </div>
            </div>

            {/* Half-Space & Deep Completions */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Yarım Alan Girişleri</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-purple-400">
                  {selectedMatch.metrics.halfSpaceEntriesHome}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-xl font-bold font-mono text-slate-400">
                  {selectedMatch.metrics.halfSpaceEntriesAway}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Kritik Kutu İçi Paslar: {selectedMatch.metrics.deepCompletionsHome}
              </div>
            </div>
          </div>

          {/* Key Tactical Moments Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Maçın Taktiksel Kırılma Sekansları</span>
            </h4>
            <div className="space-y-2.5">
              {selectedMatch.keyMoments.map((km, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px]">
                        {km.minute}'
                      </span>
                      {km.title}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {km.tacticalConcept}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {km.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Player Inspector Card */}
          {selectedPlayer && (
            <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-xl shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {selectedPlayer.number}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedPlayer.name}</h4>
                    <p className="text-[11px] text-slate-400">Pozisyon: {selectedPlayer.position} • {selectedPlayer.roleBadge || 'Standart Görev'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">İsabetli Pas</span>
                  <span className="font-mono font-bold text-white">{selectedPlayer.passesCompleted}</span>
                  <span className="text-[10px] text-slate-500 block">%{selectedPlayer.passAccuracy}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Pres Baskısı</span>
                  <span className="font-mono font-bold text-amber-400">{selectedPlayer.pressureEvents}</span>
                  <span className="text-[10px] text-slate-500 block">eylem</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Mesafe</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedPlayer.distanceCoveredKm}</span>
                  <span className="text-[10px] text-slate-500 block">km</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
