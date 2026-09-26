# ⚽ TacticalVision AI
### AI-Driven Football Analytics & Automated Content Creation System

> An end-to-end platform engineered to transform raw football match statistics and match footage into high-impact tactical narratives, deep statistical visualizations, computerized telestration graphics, and automatically edited YouTube video packages — styled after premier analytical storytelling formats like *"Hastalık Bu Futbol"*.

---

## 📌 1. Project Overview

**TacticalVision AI** bridges quantitative data science, computer vision, deep analytical storytelling, and automated video editing. It transforms complex match telemetry (xG, pass networks, PPDA, half-space penetration, Zone 14 dominance) into cinematic, philosophical, and tactical video essays.

The system is delivered as a dual-layer architecture:
1. **Interactive Tactical Studio (React 19 + TypeScript + Tailwind CSS)**: A full-featured web workstation for match data ingestion, interactive 2D pitch telestration, live YOLO tracking inspection, Gemini-powered script generation, and multi-track video timeline editing.
2. **Event-Driven Python Microservices (`services/`)**: Scalable, decoupled backend workers handling data ingestion, deep learning computer vision (YOLOv11 + ByteTrack), narrative synthesis, and FFmpeg/MoviePy video composition.

---

## 🏗️ 2. System Architecture

The system utilizes an **Event-Driven Microservices** architecture with asynchronous job queues, isolating heavy GPU/CPU rendering and computer vision tasks from the real-time web studio.

```
       ┌──────────────────────────────────────────────────────────┐
       │     Interactive Tactical Studio UI (React 19 + Vite)     │
       │       - 2D Pitch Telestration & Pass Network Visualizer  │
       │       - CV Detections & Radar Tracking Inspector         │
       │       - Multi-Track Timeline & Voiceover Previewer       │
       └─────────────────────────────┬────────────────────────────┘
                                     │ HTTP / WebSocket / SSE
                                     ▼
       ┌──────────────────────────────────────────────────────────┐
       │     API Gateway & Task Orchestrator (FastAPI / Express)  │
       └─────────────────────────────┬────────────────────────────┘
                                     │ Redis Message Broker
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ 1. Data Engine      │   │ 2. Vision Engine    │   │ 3. Story Engine     │
│ - StatsBomb/Opta    │   │ - YOLOv11 Detector  │   │ - Google Gemini API │
│ - xG & Pass Matrix  │   │ - ByteTrack Tracker │   │ - Scene Timeline    │
│ - Field Tilt & PPDA │   │ - Pitch Homography  │   │ - Voiceover Directs │
└──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                          ┌─────────────────────┐
                          │ 4. Video Composer   │
                          │ - FFmpeg Telestrate │
                          │ - MoviePy Stitcher  │
                          │ - TTS Audio Dubber  │
                          └──────────┬──────────┘
                                     │
                                     ▼
                          [ Final YouTube Video ]
```

---

## 🛠️ 3. Technology Stack

| Domain | Technology / Library | Role & Rationale |
| :--- | :--- | :--- |
| **Frontend Studio** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide | High-performance interactive UI, responsive canvas pitch, draggable overlays, zero latency. |
| **Backend & Orchestrator**| Node.js / Express (`server.ts`) & FastAPI (`services/`) | Lightweight API proxy, file streaming, Redis task orchestration. |
| **Data & Metrics** | Python (`pandas`, `numpy`, `mplsoccer`, `scipy`) | Event data parsing, xG maps, pass completion matrices, territorial dominance calculation. |
| **Computer Vision** | `ultralytics` (YOLOv11), `supervision`, `opencv-python` | Object detection (players, referee, ball), multi-object tracking (ByteTrack), 2D planar homography. |
| **Storytelling & LLM** | `@google/genai` (Node) / `google-genai` (Python) | Gemini 2.5 Flash / Pro with structured JSON schema output for scene-by-scene scriptwriting. |
| **Speech & Audio** | Web Speech API / ElevenLabs / Gemini Audio | Natural conversational voice synthesis with emotional tone cues (`[Dramatic]`, `[Whisper]`, `[High-Pace]`). |
| **Video Composition** | FFmpeg, MoviePy | Frame-accurate clip cutting, tactical overlays (circles, spotlights, vector arrows), multi-audio mixing. |

---

## 📂 4. Project Directory Structure

```
tacticalvision-ai/
├── README.md                          # Comprehensive technical documentation
├── metadata.json                      # AI Studio capabilities configuration
├── package.json                       # Web studio dependencies & npm scripts
├── vite.config.ts                     # Vite 6 + Tailwind CSS v4 bundling
├── server.ts                          # Express server with Vite middleware integration
├── index.html                         # SPA application entry point
│
├── src/                               # 🖥️ Interactive Web Studio (React 19)
│   ├── types/
│   │   └── football.ts                # TypeScript domain models (Match, Scene, TelestrationCue)
│   ├── data/
│   │   └── sampleMatches.ts           # Pre-configured test datasets (El Clásico, Premier League)
│   ├── services/
│   │   └── geminiService.ts           # Gemini 3.8 Flash SDK integration & tactical prompt engine
│   ├── components/
│   │   ├── Navbar.tsx                 # Navigation header & active module switcher
│   │   ├── common/
│   │   │   └── TacticalPitch.tsx      # Reusable SVG/Canvas 2D football pitch with telestrations
│   │   └── modules/
│   │       ├── DataEngineModule.tsx   # Module 1: xG Shot Map, Pass Network, Field Tilt
│   │       ├── VisionTrackingModule.tsx# Module 2: YOLO Tracking, Spotlights, 2D Radar Homography
│   │       ├── StorytellingModule.tsx # Module 3: HBF Script Engine, Voice Directives, YouTube SEO
│   │       ├── VideoComposerModule.tsx# Module 4: Multi-track Timeline, Telestrations, TTS Dubbing
│   │       └── ArchitectureDocsModule.tsx # Interactive Architecture & Python Code Hub
│   ├── App.tsx                        # Main state orchestrator & active module router
│   └── index.css                      # Tailwind CSS v4 and tactical animations
│
└── services/                          # 🐍 Python Event-Driven Microservices
    ├── data_engine/
    │   └── main.py                    # Match data parsing (StatsBomb/Opta), xG, and pass matrix
    ├── vision_engine/
    │   └── main.py                    # YOLOv11 player detection, tracking, and homography projection
    ├── storytelling_engine/
    │   └── main.py                    # Gemini tactical prompt chain & structured script generator
    └── video_composer/
        └── main.py                    # FFmpeg & MoviePy automated video rendering engine
```

---

## 🚀 5. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**: Package manager
- **Python**: 3.10+ (for Python microservices)
- **FFmpeg**: Installed locally on system PATH (for video composition)

### 1. Web Studio Setup
```bash
# Clone the repository
git clone https://github.com/your-username/tacticalvision-ai.git
cd tacticalvision-ai

# Install dependencies
npm install

# Start development server (runs full-stack on port 3000)
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Environment Variables Configuration
Create a `.env` file in the project root:
```env
# Gemini API Key (Required for AI storytelling and script generation)
GEMINI_API_KEY="your-google-gemini-api-key"

# Port configuration
PORT=3000

# App hosting URL
APP_URL="http://localhost:3000"
```

### 3. Python Microservices Setup
To execute or extend the backend services independently:
```bash
# Navigate to the project root and create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python microservice dependencies
pip install fastapi uvicorn pydantic pandas numpy opencv-python ultralytics supervision moviepy google-genai
```

---

## 🧩 6. How to Extend Modular Components

Each module is designed with strict boundaries and well-defined contracts:

### Module 1: Data Ingestion & Metrics (`services/data_engine/`)
- **Adding new data sources**: Implement a parser in `services/data_engine/main.py` that maps proprietary event streams (Wyscout, InStat, Sportec) to the standard `MatchData` schema defined in `src/types/football.ts`.
- **Custom Metrics**: Add custom mathematical models (e.g., Expected Threat / xT, Possession Value, Counter-press Recovery Time).

### Module 2: Computer Vision & Tracking (`services/vision_engine/`)
- **Custom Weights**: Drop fine-tuned YOLOv11/v12 weights (trained on soccer broadcast feeds) into the detector path.
- **Homography Calibration**: Enhance 4-point pitch corner detection with automatic keypoint mapping using field markings (penalty box arcs, center circle).

### Module 3: Storytelling & Script Engine (`services/storytelling_engine/` & `src/services/geminiService.ts`)
- **Tone Calibration**: Customize prompt guidelines in `geminiService.ts` to support diverse commentary profiles (analytical breakdown, documentary style, rapid-fire shorts).
- **Multi-language Support**: Add international language adapters while maintaining dramatic cadence and football terminology.

### Module 4: Automated Video Composer (`services/video_composer/`)
- **Custom Telestrations**: Add dynamic SVG graphic overlays such as defensive block convex hulls, passing velocity vectors, and offside line extrusions.
- **TTS Synthesis**: Connect third-party TTS engines (e.g., ElevenLabs API or Kokoro-82M) for voiceover rendering.

---

## 📄 7. License

This project is licensed under the **Apache-2.0 License**. See the LICENSE file for details.
