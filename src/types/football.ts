export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: 'home' | 'away';
  x: number; // 0 to 100 pitch coordinates
  y: number; // 0 to 100 pitch coordinates
  roleBadge?: string;
  passesCompleted: number;
  passAccuracy: number;
  pressureEvents: number;
  distanceCoveredKm: number;
}

export interface ShotEvent {
  id: string;
  minute: number;
  player: string;
  teamId: 'home' | 'away';
  x: number;
  y: number;
  xG: number;
  result: 'Goal' | 'Saved' | 'Blocked' | 'Miss';
  shotType: 'Open Play' | 'Counter' | 'Set Piece' | 'Penalty';
  description: string;
}

export interface PassLink {
  fromPlayerId: string;
  toPlayerId: string;
  count: number;
  completed: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  threatScore: number; // 0 to 1
}

export interface TacticalMetrics {
  fieldTiltHome: number; // e.g. 62%
  fieldTiltAway: number;
  ppdaHome: number; // Passes per Defensive Action e.g. 8.4
  ppdaAway: number;
  totalXgHome: number;
  totalXgAway: number;
  deepCompletionsHome: number;
  deepCompletionsAway: number;
  halfSpaceEntriesHome: number;
  halfSpaceEntriesAway: number;
  highTurnoversHome: number;
  highTurnoversAway: number;
}

export interface MatchData {
  id: string;
  title: string;
  competition: string;
  date: string;
  homeTeam: {
    name: string;
    formation: string;
    manager: string;
    color: string;
  };
  awayTeam: {
    name: string;
    formation: string;
    manager: string;
    color: string;
  };
  score: string;
  tacticalThesis: string;
  players: Player[];
  shots: ShotEvent[];
  passLinks: PassLink[];
  metrics: TacticalMetrics;
  keyMoments: {
    minute: number;
    title: string;
    description: string;
    tacticalConcept: string;
  }[];
}

export interface TrackingPoint {
  id: string;
  type: 'player_home' | 'player_away' | 'ball' | 'referee';
  number?: number;
  name?: string;
  x: number; // Broadcast screen space 0-100 or pitch 0-100
  y: number;
  radarX: number; // 2D bird's-eye pitch coordinates 0-100
  radarY: number;
  speedKmh?: number;
  role?: string;
  highlight?: boolean;
}

export interface VideoKeyframe {
  timestampSec: number;
  timecode: string;
  phase: string;
  actionTitle: string;
  description: string;
  trackingPoints: TrackingPoint[];
  telestrations: {
    type: 'spotlight' | 'arrow' | 'corridor' | 'zone' | 'offside_line';
    targetId?: string;
    from?: { x: number; y: number };
    to?: { x: number; y: number };
    polygon?: { x: number; y: number }[];
    label?: string;
    color: string;
  }[];
}

export interface VideoClipSequence {
  id: string;
  title: string;
  durationSec: number;
  fps: number;
  category: 'High-Press Trap' | 'Counter-Attack Transition' | 'Low-Block Overload' | 'Half-Space Penetration';
  keyframes: VideoKeyframe[];
}

export interface StoryScene {
  id: string;
  sceneNumber: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  title: string;
  narrativeTone: 'Dramatik' | 'Analitik' | 'Fısıltı & Gizem' | 'Yüksek Tempolu' | 'Felsefi Kapanış';
  voiceoverText: string;
  visualDirection: string;
  telestrationDirective: string;
  recommendedClipPhase: string;
  statsCallout?: string;
}

export interface StoryScript {
  id: string;
  title: string;
  subtitle: string;
  authorStyle: 'Hastalık Bu Futbol';
  hookTitle: string;
  tacticalThesis: string;
  narrativeSummary: string;
  scenes: StoryScene[];
  youtubeMetadata: {
    videoTitleCandidates: string[];
    descriptionWithTimestamps: string;
    tags: string[];
    thumbnailPrompt: string;
  };
}
