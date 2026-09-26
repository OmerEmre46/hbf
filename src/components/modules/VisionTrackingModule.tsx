import React, { useState, useEffect } from 'react';
import { VideoClipSequence, VideoKeyframe } from '../../types/football';
import { TacticalPitch } from '../common/TacticalPitch';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sliders,
  Crosshair,
  Compass,
  Layers,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface VisionTrackingModuleProps {
  clipSequence: VideoClipSequence;
  onProceedToStorytelling: () => void;
}

export const VisionTrackingModule: React.FC<VisionTrackingModuleProps> = ({
  clipSequence,
  onProceedToStorytelling,
}) => {
  const [currentKeyframeIdx, setCurrentKeyframeIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showSpotlights, setShowSpotlights] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showRadarSync, setShowRadarSync] = useState<boolean>(true);

  const keyframes = clipSequence.keyframes;
  const currentKeyframe: VideoKeyframe = keyframes[currentKeyframeIdx] || keyframes[0];

  // Auto-cycle through keyframes if playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentKeyframeIdx((prev) => (prev + 1) % keyframes.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, keyframes.length]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              MODÜL 2 / 4
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Görüntü İşleme ve Bilgisayarlı Görü (Computer Vision)
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            YOLOv11 ve ByteTrack ile maç yayınından oyuncu tespiti, kimlik takibi, taktiksel spotlight ve 2D homografi projeksiyonu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Durdur' : 'Sekansı Oynat'}</span>
          </button>

          <button
            onClick={onProceedToStorytelling}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:translate-x-0.5"
          >
            <span>Senaryo Oluşturucuya Geç</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Broadcast Feed Telestration Canvas & 2D Bird's Eye Homography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Camera Feed View (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold">YAYIN KAMERASI CV İŞLEME</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-semibold">{currentKeyframe.timecode}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{currentKeyframe.phase}</span>
              </div>

              {/* Overlay Toggle Controls */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showBoxes
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="YOLO Bounding Boxes"
                >
                  Kutular
                </button>
                <button
                  onClick={() => setShowSpotlights(!showSpotlights)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showSpotlights
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Spotlight Haleleri"
                >
                  Spotlight
                </button>
                <button
                  onClick={() => setShowVectors(!showVectors)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showVectors
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Taktiksel Pas/Koşu Okları"
                >
                  Oklar
                </button>
                <button
                  onClick={() => setShowZones(!showZones)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showZones
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Taktik Alan Gölgelendirmesi"
                >
                  Bölgeler
                </button>
              </div>
            </div>

            {/* Broadcast Canvas Display */}
            <div className="relative aspect-[16/9] bg-gradient-to-b from-slate-950 via-[#07190f] to-[#040c08] overflow-hidden select-none">
              {/* Pitch Perspective Lines Background */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse 120% 70% at 50% 120%, rgba(16, 185, 129, 0.25) 0%, transparent 80%),
                    linear-gradient(to top, rgba(16, 185, 129, 0.15) 0%, transparent 60%)
                  `,
                }}
              />

              {/* Synthetic Broadcast Field Markers (Simulating pitch angle) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 56.25" preserveAspectRatio="none">
                {/* 3D Perspective Pitch Markings */}
                <polygon points="10,50 90,50 82,15 18,15" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
                <line x1="50" y1="50" x2="50" y2="15" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3" />
                <ellipse cx="50" cy="32.5" rx="8" ry="4" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3" />

                {/* Tactical Zones & Corridors */}
                {showZones &&
                  currentKeyframe.telestrations
                    .filter((t) => t.type === 'zone')
                    .map((zone, i) => (
                      <g key={`zone-${i}`}>
                        <rect
                          x="38"
                          y="18"
                          width="44"
                          height="28"
                          fill="rgba(239, 68, 68, 0.18)"
                          stroke="rgba(239, 68, 68, 0.6)"
                          strokeWidth="0.3"
                          strokeDasharray="1,1"
                        />
                        <text x="60" y="22" fill="#F87171" fontSize="1.8" textAnchor="middle" fontWeight="bold">
                          {zone.label}
                        </text>
                      </g>
                    ))}

                {/* Telestration Vectors / Arrows */}
                {showVectors &&
                  currentKeyframe.telestrations
                    .filter((t) => t.type === 'arrow' || t.type === 'corridor')
                    .map((vec, i) => {
                      if (!vec.from || !vec.to) return null;
                      const x1 = (vec.from.x * 80) / 100 + 10;
                      const y1 = (vec.from.y * 35) / 100 + 15;
                      const x2 = (vec.to.x * 80) / 100 + 10;
                      const y2 = (vec.to.y * 35) / 100 + 15;

                      return (
                        <g key={`vec-${i}`}>
                          <defs>
                            <marker
                              id={`arrow-${i}`}
                              viewBox="0 0 10 10"
                              refX="6"
                              refY="5"
                              markerWidth="4"
                              markerHeight="4"
                              orient="auto-start-reverse"
                            >
                              <path d="M 0 1 L 10 5 L 0 9 z" fill={vec.color} />
                            </marker>
                          </defs>
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={vec.color}
                            strokeWidth="0.6"
                            strokeDasharray="1.5,1"
                            markerEnd={`url(#arrow-${i})`}
                          />
                          {vec.label && (
                            <text
                              x={(x1 + x2) / 2}
                              y={(y1 + y2) / 2 - 1.5}
                              fill={vec.color}
                              fontSize="1.6"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              {vec.label}
                            </text>
                          )}
                        </g>
                      );
                    })}

                {/* Players & Tracking Detections */}
                {currentKeyframe.trackingPoints.map((pt) => {
                  // Transform coordinate into perspective screen space
                  const sx = (pt.x * 80) / 100 + 10;
                  const sy = (pt.y * 35) / 100 + 15;
                  const isBall = pt.type === 'ball';
                  const isHome = pt.type === 'player_home';
                  const primaryColor = isBall ? '#FACC15' : isHome ? '#38BDF8' : '#F87171';

                  return (
                    <g key={pt.id} className="transition-all duration-300">
                      {/* Spotlight Ground Ring */}
                      {showSpotlights && !isBall && pt.highlight && (
                        <g>
                          <ellipse
                            cx={sx}
                            cy={sy + 3}
                            rx="3.5"
                            ry="1.5"
                            fill="none"
                            stroke={primaryColor}
                            strokeWidth="0.5"
                            strokeDasharray="1,0.5"
                          />
                          <ellipse
                            cx={sx}
                            cy={sy + 3}
                            rx="5"
                            ry="2.2"
                            fill={primaryColor}
                            fillOpacity={0.15}
                          />
                        </g>
                      )}

                      {/* YOLO Bounding Box */}
                      {showBoxes && !isBall && (
                        <g>
                          <rect
                            x={sx - 1.8}
                            y={sy - 4.5}
                            width="3.6"
                            height="7.5"
                            fill="none"
                            stroke={primaryColor}
                            strokeWidth="0.25"
                            strokeDasharray="1,0.5"
                            opacity={0.8}
                          />
                          {/* ID Badge */}
                          <rect
                            x={sx - 1.8}
                            y={sy - 6}
                            width="3.6"
                            height="1.5"
                            fill={primaryColor}
                          />
                          <text
                            x={sx}
                            y={sy - 4.9}
                            fill="#0f172a"
                            fontSize="1.1"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {pt.number || pt.id}
                          </text>
                        </g>
                      )}

                      {/* Player Marker / Dot */}
                      <circle
                        cx={sx}
                        cy={sy}
                        r={isBall ? 0.9 : 1.6}
                        fill={primaryColor}
                        stroke="#ffffff"
                        strokeWidth={0.3}
                      />

                      {/* Role or Name Tag */}
                      {pt.role && (
                        <g>
                          <rect
                            x={sx - 8}
                            y={sy + 5}
                            width="16"
                            height="2.4"
                            rx="0.6"
                            fill="rgba(15, 23, 42, 0.85)"
                            stroke={primaryColor}
                            strokeWidth="0.2"
                          />
                          <text
                            x={sx}
                            y={sy + 6.7}
                            fill="#F8FAFC"
                            fontSize="1.2"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {pt.name}: {pt.role}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Broadcast Watermark & HUD */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-white block">{currentKeyframe.actionTitle}</span>
                <span className="text-[10px] text-slate-400">{currentKeyframe.description}</span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-emerald-400">
                <Crosshair className="w-3 h-3 text-emerald-400" />
                <span>YOLOv11 CV INFERENCE: 24.2ms</span>
              </div>
            </div>

            {/* Timeline Keyframe Scrubber */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Sekans Kareleri:</span>
                <div className="flex items-center gap-1.5">
                  {keyframes.map((kf, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentKeyframeIdx(i);
                        setIsPlaying(false);
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
                        i === currentKeyframeIdx
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {kf.timecode} ({kf.phase.slice(0, 10)}...)
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentKeyframeIdx(0)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Başa Sar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2D Homography Bird's Eye Radar & Technical Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">2D Homografi Kuşbakışı Radar</h3>
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                Kamera Açısından 2D Düzleme
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Yayın kamerası açısı homografi matrisi (OpenCV <code className="text-emerald-400">cv2.findHomography</code>) ile düzeltilerek oyuncuların tam saha koordinatları hesaplanır.
            </p>

            {/* Synchronized Radar Pitch */}
            <TacticalPitch
              mode="vision-radar"
              trackingPoints={currentKeyframe.trackingPoints}
              homeColor="#38BDF8"
              awayColor="#F87171"
              homeTeamName="Man City"
              awayTeamName="Real Madrid"
            />

            {/* Detected Keyframe Event & Directives */}
            <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kurgu İçin Otomatik Telestrasyon Direktifleri</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Phase #{currentKeyframeIdx + 1}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {currentKeyframe.telestrations.map((tel, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tel.color }} />
                    <span className="font-mono text-[10px] uppercase text-slate-400">[{tel.type}]</span>
                    <span className="text-slate-200 text-[11px]">{tel.label || 'Vurgu Direktifi'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
