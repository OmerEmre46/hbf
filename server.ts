import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
let aiClient: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI();
  }
} catch (e) {
  console.warn('Google GenAI initialization notice:', e);
}

// System prompt mimicking the signature "Hastalık Bu Futbol" storytelling style
const HBF_SYSTEM_PROMPT = `
Sen Türkiye'nin en sevilen, en derin futbol analitiği ve hikaye anlatıcılığı kanalı olan "Hastalık Bu Futbol" YouTube kanalının baş metin yazarı ve taktik dehasısın.
Senin üslubun:
1. Edebi, sinematik, felsefi ve aynı zamanda cerrahi bir analitik derinliğe sahiptir.
2. Futbolu sadece "top ve 22 kişi" olarak görmezsin; insan psikolojisi, alan geometrisi, taktik tuzaklar, acı çekme kültürü ve kader kavramlarıyla harmanlarsın.
3. Kuru istatistik vermezsin; veriyi (xG, PPDA, pas ağı, yarım alan sızmaları) bir cinayet mahalindeki kanıt gibi hikayeye yedirirsin.
4. Anlatımda ses tonu yönergeleri belirlersin: [Dramatik], [Analitik], [Fısıltı], [Yüksek Tempolu], [Felsefi Kapanış].
5. Kurgucuya ve video grafik motoruna net telestrasyon direktifleri (oklar, spotlight halkaları, alan boyamaları, ağır çekimler) sunarsın.

Kullanıcı sana bir maçın taktik verilerini, xG değerlerini, oyuncu istatistiklerini ve odaklanılacak taktik hipotezi verdiğinde, bunu sahne sahne kurgulanmış profesyonel bir YouTube video senaryosuna dönüştürmelisin.
Cevabını SADECE geçerli bir JSON formatında ver.
`;

app.post('/api/generate-story', async (req, res) => {
  try {
    const { matchData, focusTopic, desiredDurationSec, customNotes } = req.body;

    if (!matchData) {
      return res.status(400).json({ error: 'matchData is required' });
    }

    const promptText = `
Aşağıdaki maç verilerini ve taktik parametreleri kullanarak "Hastalık Bu Futbol" YouTube kanalı için sahne sahne kurgulanmış tam bir video senaryosu üret:

MAÇ BİLGİLERİ:
- Karşılaşma: ${matchData.title} (${matchData.competition})
- Ev Sahibi: ${matchData.homeTeam.name} (${matchData.homeTeam.formation}, Teknik Direktör: ${matchData.homeTeam.manager})
- Deplasman: ${matchData.awayTeam.name} (${matchData.awayTeam.formation}, Teknik Direktör: ${matchData.awayTeam.manager})
- Skor: ${matchData.score}
- Taktiksel Tez: ${matchData.tacticalThesis}
- Metrikler:
  * Field Tilt: %${matchData.metrics.fieldTiltHome} vs %${matchData.metrics.fieldTiltAway}
  * xG: ${matchData.metrics.totalXgHome} vs ${matchData.metrics.totalXgAway}
  * PPDA (Pres Yoğunluğu): ${matchData.metrics.ppdaHome} vs ${matchData.metrics.ppdaAway}
  * Yarım Alan (Half-space) Girişleri: ${matchData.metrics.halfSpaceEntriesHome} vs ${matchData.metrics.halfSpaceEntriesAway}
- Odaklanılacak Konu / Kullanıcı Notu: ${focusTopic || 'Taktiksel bloklaşma, alan parselasyonu ve kırılma anları'} ${customNotes || ''}

Aşağıdaki JSON şemasına BİREBİR uygun bir JSON yanıtı döndür (Markdown backtickleri olmadan doğrudan JSON veya json code block içinde):
{
  "title": "Çarpıcı, merak uyandıran ana video başlığı",
  "subtitle": "Açıklayıcı taktiksel alt başlık",
  "hookTitle": "İlk 5 saniyede ekrana gelecek kanca cümle",
  "tacticalThesis": "Detaylı 2-3 cümlelik ana taktik hipotez",
  "narrativeSummary": "Videonun genel felsefi ve analitik özeti",
  "scenes": [
    {
      "sceneNumber": 1,
      "startSec": 0,
      "endSec": 20,
      "durationSec": 20,
      "title": "Sahne Başlığı",
      "narrativeTone": "Dramatik",
      "voiceoverText": "Spikerin okuyacağı edebi ve vurucu Türkçe seslendirme metni",
      "visualDirection": "Kameranın neyi göstereceği, klip kesimi ve görüntü planı",
      "telestrationDirective": "Ekrana çizilecek grafik direktifleri (örn: De Bruyne üzerine sarı spotlight, savunma arkasına kırmızı koşu oku)",
      "recommendedClipPhase": "Düşük Blok / Geçiş Hücumu / Pres Kapanı / Gol Vuruşu",
      "statsCallout": "Ekrana alt yazı/badge olarak gelecek kritik veri"
    }
  ],
  "youtubeMetadata": {
    "videoTitleCandidates": ["Başlık Önerisi 1", "Başlık Önerisi 2", "Başlık Önerisi 3"],
    "descriptionWithTimestamps": "Zaman kodlu YouTube video açıklaması",
    "tags": ["etiket1", "etiket2", "etiket3"],
    "thumbnailPrompt": "YouTube küçük resmi (thumbnail) için yapay zeka görsel üretim promptu"
  }
}
Lütfen en az 4, en fazla 6 sahne oluştur.
`;

    if (process.env.GEMINI_API_KEY) {
      const ai = aiClient || new GoogleGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: HBF_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, script: parsed, source: 'gemini-3.8-flash' });
      } catch (parseErr) {
        // If JSON wrapped in markdown
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, script: parsed, source: 'gemini-3.8-flash' });
      }
    } else {
      // Fallback generator when GEMINI_API_KEY is not configured yet
      return res.json({
        success: true,
        source: 'local-tactical-template',
        notice: 'GEMINI_API_KEY henüz eklenmediği için gelişmiş taktiksel HBF şablonu kullanıldı. Secrets panelinden anahtarınızı ekleyebilirsiniz.',
        script: {
          title: `${matchData.homeTeam.name} vs ${matchData.awayTeam.name}: Matematik mi, Tutku mu?`,
          subtitle: `${matchData.tacticalThesis.slice(0, 80)}...`,
          hookTitle: 'Sahada 22 Kişi Koşar, Fakat Bazen Sadece 1.5 Metrelik Bir Boşluk Kaderi Belirler...',
          tacticalThesis: matchData.tacticalThesis,
          narrativeSummary: `${matchData.homeTeam.name} taktiksel olarak oyunu rakip yarı sahaya yıkmasına rağmen (Field Tilt: %${matchData.metrics.fieldTiltHome}), rakibin kompakt yerleşimi ve geçiş fırsatları maçın kırılma anını yarattı.`,
          scenes: [
            {
              sceneNumber: 1,
              startSec: 0,
              endSec: 15,
              durationSec: 15,
              title: 'Giriş: Yeşil Sahadaki Taktik Satranç',
              narrativeTone: 'Dramatik',
              voiceoverText: `Modern futbol artık sadece ayakla oynanan bir oyun değil; santimetrekarelerin ve saniyelerin savaşı. ${matchData.title} karşılaşmasında işte tam olarak bu satranç tahtası kuruldu.`,
              visualDirection: 'Sahanın genel planından antrenör kulübesine sinematik yaklaşım. Ekranda maç skoru ve xG kıyaslaması.',
              telestrationDirective: 'Saha merkezinde genişleme çemberi, iki teknik direktörün taktik dizilişlerinin çakışması.',
              recommendedClipPhase: 'Düşük Blok Yerleşimi',
              statsCallout: `xG: ${matchData.metrics.totalXgHome} - ${matchData.metrics.totalXgAway}`,
            },
            {
              sceneNumber: 2,
              startSec: 15,
              endSec: 45,
              durationSec: 30,
              title: 'Taktiksel Kapan: Merkez Koridorun Boğulması',
              narrativeTone: 'Analitik',
              voiceoverText: `Şuraya çok dikkatli bakın. Savunma hattı ile orta saha arasındaki mesafe sadece 14 metre. Bu dar alanda ${matchData.awayTeam.name} rakibine nefes aldırmıyor. PPDA değeri ${matchData.metrics.ppdaAway} seviyesine çekilirken, rakip kanatlara sürülüyor.`,
              visualDirection: '2D Kuşbakışı radar ve yayın kamerası senkronizasyonu. Savunma bloğunun sağa ve sola kayışı.',
              telestrationDirective: 'Savunma 4\'lüsünün arasında kırmızı emniyet şeridi çizgisi, pas alıcı üzerindeki pres baskı göstergesi.',
              recommendedClipPhase: 'Pres Kapanı',
              statsCallout: `PPDA: ${matchData.metrics.ppdaAway} | Field Tilt: %${matchData.metrics.fieldTiltAway}`,
            },
            {
              sceneNumber: 3,
              startSec: 45,
              endSec: 75,
              durationSec: 30,
              title: 'Kırılma Anı: Yarım Alandaki Sızıntı',
              narrativeTone: 'Yüksek Tempolu',
              voiceoverText: `Ve o an geliyor. 80 dakika boyunca kusursuz işleyen bir mekanizma, sadece yarım saniyelik bir gecikmeyle çatırdar. Dönen top, savunmanın arkasında unutulan yarım alan koridoru ve gelen ölümcül vuruş!`,
              visualDirection: 'Klipte topun çizgiden içeri çevrilişi, ceza sahası önünde seken top ve vuruş anında dondurulan kare (freeze-frame).',
              telestrationDirective: 'Sahanın sol yarım alanına (half-space) sarı ışık koridoru, şut atan oyuncunun üzerine hedef spotlight halkası.',
              recommendedClipPhase: 'Kırılma & Gol Pozisyonu',
              statsCallout: 'Şut xG Değeri: 0.54',
            },
            {
              sceneNumber: 4,
              startSec: 75,
              endSec: 105,
              durationSec: 30,
              title: 'Felsefi Kapanış: Taktik ve İnsan Ruhu',
              narrativeTone: 'Felsefi Kapanış',
              voiceoverText: 'Son düdük çaldığında geriye analizler, grafikler ve sayılar kalır. Ama futbolu güzel kılan da budur: Kusursuz planlar bile insan faktörünün karşısında eğilebilir. Hastalık Bu Futbol\'da bir taktik dosyasının daha sonuna geldik. Abone olmayı ve bu taktik savaş hakkındaki görüşlerinizi yazmayı unutmayın.',
              visualDirection: 'Hakemin son düdüğü, stadyum ışıkları ve yavaşça kararan sahne. Kanal logosu ve abone ol animasyonu.',
              telestrationDirective: 'Ekranda "Taktik Plan vs Gerçeklik" karşılaştırma kartı.',
              recommendedClipPhase: 'Kapanış',
              statsCallout: 'Maç Sonu Analizi Tamamlandı',
            },
          ],
          youtubeMetadata: {
            videoTitleCandidates: [
              `${matchData.title} | Taktik Analiz & Kusursuz Planın Çöküşü`,
              `Futbol Neden Matematikle Açıklanamaz? | ${matchData.homeTeam.name} - ${matchData.awayTeam.name}`,
              `Taktik Tahtasında Kazanılan, Sahada Kaybedilen Maç | Hastalık Bu Futbol`,
            ],
            descriptionWithTimestamps: `00:00 Giriş & Taktiksel Satranç\n00:15 Savunma Seddi ve Pres Kapanı\n00:45 Kırılma Anı ve Kusur Tespiti\n01:15 Felsefi Kapanış\n\nBu videoda ${matchData.title} mücadelesini Hastalık Bu Futbol üslubuyla derinlemesine inceliyoruz.`,
            tags: ['futbol analizi', 'hastalık bu futbol', 'taktik analiz', 'xG', 'antrenör taktikleri'],
            thumbnailPrompt: `Dramatik karanlık stüdyo, ortada taktik tahtası ve arkada parlayan yeşil çim stadyum ışıkları, teknik direktör silueti ve büyük sarı yazı: "KUSURSUZ PLAN NASIL ÇÖKTÜ?"`,
          },
        },
      });
    }
  } catch (error: any) {
    console.error('Error generating story:', error);
    return res.status(500).json({ error: error.message || 'Hikaye senaryosu oluşturulurken bir hata oluştu.' });
  }
});

// Production static serve or dev Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TacticalVision AI Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
