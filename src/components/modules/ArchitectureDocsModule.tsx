import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Layers,
  FileCode,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Box,
  Share2,
} from 'lucide-react';

export const ArchitectureDocsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'python_services' | 'docker'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const pythonDataEngineCode = `"""
Module 1: Data Ingestion & Metric Engine (Python)
Services/data_engine/metrics.py
"""
import pandas as pd
import numpy as np

class FootballAnalyticsEngine:
    def __init__(self, match_events_df: pd.DataFrame):
        self.events = match_events_df

    def calculate_field_tilt(self, home_team: str, away_team: str) -> dict:
        """Calculates 3rd pitch zone possession dominance (Field Tilt)"""
        final_third_passes = self.events[
            (self.events['type'] == 'Pass') & (self.events['x'] >= 67)
        ]
        home_passes = len(final_third_passes[final_third_passes['team'] == home_team])
        away_passes = len(final_third_passes[final_third_passes['team'] == away_team])
        total = home_passes + away_passes
        return {
            "home": round((home_passes / total) * 100, 1) if total > 0 else 50.0,
            "away": round((away_passes / total) * 100, 1) if total > 0 else 50.0
        }

    def compute_ppda(self, defending_team: str) -> float:
        """Passes per Defensive Action (High-press intensity metric)"""
        opponent_passes = len(self.events[
            (self.events['team'] != defending_team) & 
            (self.events['type'] == 'Pass') & 
            (self.events['x'] <= 60)
        ])
        defensive_actions = len(self.events[
            (self.events['team'] == defending_team) & 
            (self.events['type'].isin(['Tackle', 'Interception', 'Foul', 'Challenge'])) & 
            (self.events['x'] >= 40)
        ])
        return round(opponent_passes / max(1, defensive_actions), 2)
`;

  const pythonVisionEngineCode = `"""
Module 2: Computer Vision & Pitch Homography (Python)
Services/vision_engine/tracker.py
"""
import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv

class TacticalVisionPipeline:
    def __init__(self, model_path: str = "yolo11x.pt"):
        self.model = YOLO(model_path)
        self.tracker = sv.ByteTrack(track_thresh=0.25, track_buffer=30)
        # Broadcast to 2D 105x68m homography matrix
        self.homography_matrix = None

    def set_pitch_homography(self, src_pts: np.ndarray, dst_pts: np.ndarray):
        """src_pts: pixel coords in broadcast video; dst_pts: 2D pitch coords"""
        self.homography_matrix, _ = cv2.findHomography(src_pts, dst_pts)

    def process_frame(self, frame: np.ndarray):
        # 1. Detect players, referees, and ball
        results = self.model(frame, classes=[0, 32])[0]
        detections = sv.Detections.from_ultralytics(results)
        
        # 2. Track identities across frames
        tracked_detections = self.tracker.update_with_detections(detections)
        
        # 3. Project to 2D pitch coordinates via homography
        radar_points = []
        if self.homography_matrix is not None:
            foot_positions = tracked_detections.get_anchors_coordinates(sv.Position.BOTTOM_CENTER)
            radar_points = cv2.perspectiveTransform(
                np.array([foot_positions], dtype=np.float32), 
                self.homography_matrix
            )[0]

        return tracked_detections, radar_points
`;

  const pythonVideoComposerCode = `"""
Module 4: Automated Video Composer & Telestration (Python)
Services/video_composer/render_pipeline.py
"""
import ffmpeg
import json

def render_tactical_scene(scene_cue: dict, output_file: str):
    """
    Renders clip segment, applies SVG/Canvas telestration overlay,
    and synchronizes TTS audio track with background music.
    """
    video_input = ffmpeg.input(
        scene_cue['sourceClip'], 
        ss=scene_cue['inPointSec'], 
        t=scene_cue['durationSec']
    )
    overlay_input = ffmpeg.input(f"telestration_layer_{scene_cue['sceneNumber']}.png")
    audio_tts = ffmpeg.input(scene_cue['audioTrack']['ttsAudioFile'])
    bg_music = ffmpeg.input(scene_cue['audioTrack']['bgMusic']).filter('volume', 0.15)

    # Composite video with tactical overlay
    video_stream = ffmpeg.overlay(video_input, overlay_input)
    # Mix TTS voiceover and ambient music
    audio_stream = ffmpeg.filter([audio_tts, bg_music], 'amix', inputs=2)

    out = ffmpeg.output(
        video_stream, audio_stream, 
        output_file, 
        vcodec='libx264', acodec='aac', pix_fmt='yuv420p'
    )
    out.run(overwrite_output=True)
`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            SİSTEM MİMARİSİ & KOD REHBERİ
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Mikroservis Mimarisi ve Python Kod Altyapısı
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Projenin Event-Driven Python mikroservisleri, bilgisayarlı görü algoritmaları ve otomatik render pipeline'ı için referans kodlar.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Sistem Şeması & Akış
          </button>
          <button
            onClick={() => setActiveTab('python_services')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'python_services'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Python Mikroservis Kodları
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'docker'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Docker Compose & Kurulum
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Blueprint */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Event-Driven Mikroservis Akışı</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">1. Frontend Studio (React 19 + TypeScript)</span>
                Kullanıcı arayüzü; taktik tahtası, video önizleme, anlık veri analizi ve HBF senaryo editörünü barındırır.
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-sky-400 block mb-1">2. API Gateway & Kuyruk (FastAPI / Express + Redis)</span>
                Ağır video işleme ve CV modellerini Celery iş kuyruklarına dağıtır; kullanıcı arayüzünü asla bloke etmez.
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">3. Vision Worker (GPU - YOLOv11 + ByteTrack)</span>
                Yayın videosundaki oyuncuların ve topun piksel koordinatlarını tespit edip homografi ile 2D taktik düzlemine aktarır.
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">4. Storytelling & Composer (Gemini + FFmpeg)</span>
                Gemini 3.8 Flash edebi HBF senaryosunu üretir; FFmpeg telestrasyon okları, spotlight ve seslendirmeyi birleştirerek MP4 çıktısı üretir.
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-emerald-400" />
              <span>Teknoloji Tercih Matrisi</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Büyük Dil Modeli (LLM)</span>
                <span className="font-mono text-amber-400 font-bold">Gemini 3.8 Flash (Google GenAI)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Nesne Tespiti (Object Detection)</span>
                <span className="font-mono text-sky-400 font-bold">Ultralytics YOLOv11 / YOLOv8</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Çoklu Nesne Takibi (MOT)</span>
                <span className="font-mono text-emerald-400 font-bold">ByteTrack / BoT-SORT</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Kuşbakışı Projeksiyon</span>
                <span className="font-mono text-purple-400 font-bold">OpenCV findHomography</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Video Render & Telestrasyon</span>
                <span className="font-mono text-rose-400 font-bold">FFmpeg + MoviePy + Canvas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Python Code Snippets */}
      {activeTab === 'python_services' && (
        <div className="space-y-4">
          {/* Data Engine Code */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
              <span className="font-mono text-emerald-400 font-bold">
                services/data_engine/metrics.py (Field Tilt & PPDA)
              </span>
              <button
                onClick={() => copyCode(pythonDataEngineCode, 'code_data')}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                {copiedCode === 'code_data' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-[#070d14]">
              {pythonDataEngineCode}
            </pre>
          </div>

          {/* Vision Engine Code */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
              <span className="font-mono text-sky-400 font-bold">
                services/vision_engine/tracker.py (YOLOv11 + Homography)
              </span>
              <button
                onClick={() => copyCode(pythonVisionEngineCode, 'code_vision')}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                {copiedCode === 'code_vision' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-[#070d14]">
              {pythonVisionEngineCode}
            </pre>
          </div>

          {/* Video Composer Code */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
              <span className="font-mono text-purple-400 font-bold">
                services/video_composer/render_pipeline.py (FFmpeg)
              </span>
              <button
                onClick={() => copyCode(pythonVideoComposerCode, 'code_composer')}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                {copiedCode === 'code_composer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-[#070d14]">
              {pythonVideoComposerCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Docker Compose */}
      {activeTab === 'docker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs font-mono text-amber-400 font-bold">
            docker-compose.yml (Üretim Ortamı Dağıtımı)
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto bg-[#070d14]">
{`version: '3.8'

services:
  web-studio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      - redis-queue

  redis-queue:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  vision-worker:
    build: ./services/vision_engine
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - REDIS_URL=redis://redis-queue:6379/0

  video-composer:
    build: ./services/video_composer
    volumes:
      - ./media_storage:/app/storage
    environment:
      - REDIS_URL=redis://redis-queue:6379/0`}
          </pre>
        </div>
      )}
    </div>
  );
};
