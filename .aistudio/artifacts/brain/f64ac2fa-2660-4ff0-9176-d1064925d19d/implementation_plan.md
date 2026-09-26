# AI-Driven Football Analytics & Automated Content Creation System
## Sistem Mimarisi, Teknoloji Yığını ve Modüler Uygulama Planı

Bu mimari tasarım, **"Hastalık Bu Futbol"** tarzı derin taktiksel hikaye anlatımı, dramatik kurgu dili, analitik veri görselleştirme ve otomatik video kurgusu üretebilecek uçtan uca, modüler ve ölçeklenebilir bir platform sunmaktadır.

---

### 1. Sistem Mimarisi (Architecture Blueprint)

Sistem, CPU/GPU yoğun video ve yapay zeka görevlerinin kullanıcı arayüzünü kilitlemesini engellemek için **Event-Driven & Microservices** mimarisinde yapılandırılmıştır.

```
       [ React 19 + Tailwind Tactical Studio UI ]
                           │
                           ▼ (REST / WebSocket / SSE)
       [ API Gateway / Orchestrator (FastAPI / Express) ]
                           │
       ┌───────────────────┴────────────────────────┐
       ▼                                            ▼
[ Redis Queue / Celery ]                     [ Shared Storage ]
       │                                   (S3 / MinIO / Local Volume)
       ├─► 1. Data Ingestion Service             │  (Raw Videos, Match JSON,
       ├─► 2. Vision & Tracking Service (GPU)    │   Clips, Audio, Renders)
       ├─► 3. Storytelling & Script Engine (LLM) │
       └─► 4. Video Telestration & Rendering ───┘
```

#### Modüller Arası Akış:
1. **Veri ve Video Kabulü (Ingestion):** Kullanıcı maç videosunu ve/veya maç istatistik verilerini (Opta/StatsBomb JSON veya CSV formatında) sisteme aktarır.
2. **Görüntü İşleme & Takip (Vision Worker):** YOLOv11 + ByteTrack ile sahada oyuncular, hakem ve top tespit edilir; homografi dönüşümü ile 2D taktik tahtasına (bird's eye pitch) izdüşürülür.
3. **Taktik Çıkarım & Olay Eşleme:** Maç verisi (xG, pres dizilimi, pas bağlantıları) ile görüntü sekansları zaman damgalarıyla senkronize edilir.
4. **"Hastalık Bu Futbol" Senaryo Motoru (Gemini LLM):** Taktiksel tez, hipotez ve dramatik hikaye örgüsü üretilir. Sahne sahne zaman kodları, seslendirme metni, kullanılacak video kesitleri ve telestrasyon direktifleri yapılandırılmış JSON olarak çıkarılır.
5. **Otomatik Kurgu ve Telestrasyon (Compositor):** FFmpeg/MoviePy ve Canvas/SVG katmanları ile oyuncu üstü halkalar, pas okları, pres koridorları çizilir; TTS seslendirmesi ve arka plan müziği eklenerek nihai YouTube videosu oluşturulur.

---

### 2. Önerilen Teknoloji Yığını (Tech Stack)

| Alan | Seçilen Teknoloji / Kütüphane | Tercih Nedeni ve Rolü |
| :--- | :--- | :--- |
| **Kullanıcı Arayüzü & Stüdyo** | React 19, TypeScript, Tailwind CSS, Motion, Lucide | Gerçek zamanlı taktik tahtası, video önizleme, senaryo editörü ve kurgu kontrol paneli. |
| **Orkestrasyon & API** | FastAPI (Python) / Express (Node) + Redis & Celery | Yüksek performanslı asenkron iş kuyruğu; uzun süren video işleme süreçlerini arka planda yönetme. |
| **Veri & Metrik Analitiği** | Python (Pandas, NumPy, mplsoccer, scipy) | xG haritaları, pas ağları (pass networks), pas sonlandırma koridorları, pres yoğunluk matrisleri. |
| **Bilgisayarlı Görü (CV)** | Ultralytics YOLOv11, ByteTrack, Supervision (Roboflow), OpenCV | Oyuncu, top, kaleci ve hakem tespiti; oyuncu kimlik takibi; saha çizgilerinden 2D radar homografisi. |
| **Taktik Hikaye & Senaryo (LLM)** | Google GenAI SDK (`gemini-2.5-pro` & `gemini-2.5-flash`) | Derin analitik akıl yürütme, "Hastalık Bu Futbol" anlatım tonu, sahne kurgu JSON şemaları, YouTube başlık/açıklama optimizasyonu. |
| **Seslendirme (TTS)** | Gemini Audio Gen / ElevenLabs API / Kokoro TTS | Derin, tok, dramatik ve ritmik anlatıcı sesi üretimi; ses dalga formu zamanlama eşlemesi. |
| **Video Kurgu & Telestrasyon** | FFmpeg, MoviePy, HTML5 Canvas / SVG telestration renderer | Video kesme, ağır çekim, dondurma (freeze-frame), taktiksel halka/ok/gölge animasyonları ve ses miksi. |

---

### 3. Modüler Klasör Yapısı (Folder Structure)

Gelecekte yeni yapay zeka modelleri ve veri kaynakları eklendiğinde sistemin ölçeklenmesini sağlayan modüler şablon:

```
football-analytics-studio/
├── apps/
│   └── web/                         # React 19 Studio Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── tactical-board/  # 2D Saha & Telestrasyon çizim aracı
│       │   │   ├── video-player/    # Zaman kodlu akıllı klip oynatıcı
│       │   │   ├── script-editor/   # HBF tarzı senaryo ve seslendirme paneli
│       │   │   └── data-viz/        # xG, pas ağı ve ısı haritası grafikleri
│       │   ├── hooks/
│       │   ├── types/
│       │   └── App.tsx
│       └── package.json
│
├── services/
│   ├── data_engine/                 # 1. MODÜL: Veri İşleme & Metrik Motoru
│   │   ├── parsers/                 # StatsBomb, Opta, Wyscout, CSV ayrıştırıcılar
│   │   ├── metrics/                 # xG, PPDA, pas koridorları, alan dominansı
│   │   ├── visualizers/             # mplsoccer tarzı 2D SVG/PNG taktik grafikler
│   │   └── main.py
│   │
│   ├── vision_engine/               # 2. MODÜL: Computer Vision & Taktik Takip
│   │   ├── detectors/               # YOLOv11 oyuncu/top dedektörü
│   │   ├── trackers/                # ByteTrack çoklu nesne takibi
│   │   ├── pitch_homography/        # 2D yayın kamerasından kuşbakışı sahaya projeksiyon
│   │   └── tactical_events/         # Kontratak, savunma hattı kırılması tespiti
│   │
│   ├── storytelling_engine/         # 3. MODÜL: LLM Senaryo & Hikaye Üretimi
│   │   ├── prompts/                 # "Hastalık Bu Futbol" dramatik stil şablonları
│   │   ├── narrative_generator.py   # Giriş, Taktik Tez, Kırılma Anı, Felsefi Kapanış
│   │   ├── scene_planner.py         # Video zaman damgaları ve grafik direktifleri
│   │   └── voice_synthesis.py       # TTS entegrasyonu (ses tonu ve vurgu)
│   │
│   └── video_composer/              # 4. MODÜL: Otomatik Kurgu & Telestrasyon
│       ├── telestration/            # Daireler, yön okları, oyuncu spotlight efektleri
│       ├── timeline_builder.py      # Klip birleştirme, dondurma, yakınlaştırma
│       └── render_pipeline.py       # FFmpeg nihai çıktı motoru
│
├── shared/
│   ├── schemas/                     # Ortak JSON şemaları (MatchData, Scene, TelestrationCue)
│   └── sample_data/                 # Test amaçlı maç verileri ve video sekansları
├── docker-compose.yml
└── README.md
```

---

### 4. Adım Adım Geliştirme Yol Haritası

1. **Aşama 1: Veri İşleme Modülü (Data Engine)**
   - Maç veri yapısı standardizasyonu (MatchEvent, PlayerLocation, PassMatrix, ShotCoordinates).
   - xG haritası, pas ağı (Pass Network), pres bölgeleri ve taktiksel metrik çıkarımı.
   - React arayüzünde etkileşimli veri yükleme ve anlık grafik önizleme paneli.

2. **Aşama 2: Senaryo ve Hikaye Anlatımı Modülü (Storytelling Engine)**
   - "Hastalık Bu Futbol" felsefesini taşıyan (edebi, felsefi, analitik ve ritmik) prompt şablonu.
   - Verilen maç verisi ve önemli anlardan sahne sahne video kurgu planı (Story & Scene Timeline).

3. **Aşama 3: Bilgisayarlı Görü & Taktik Telestrasyon (Vision & Graphics)**
   - Oyuncu tespiti, dondurulan karelerde spotlight halkaları, hareket vektör okları.
   - Kuşbakışı 2D radar senkronizasyonu.

4. **Aşama 4: Otomatik Kurgu ve Çıktı Pipeline'ı (Video Composer)**
   - Video kesitlerinin, taktik katmanların ve seslendirmenin otomatik birleştirilerek nihai videoya dönüştürülmesi.
