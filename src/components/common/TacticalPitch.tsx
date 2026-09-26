import React, { useState } from 'react';
import { Player, ShotEvent, PassLink, TrackingPoint } from '../../types/football';

interface TacticalPitchProps {
  mode: 'pass-network' | 'xg-shots' | 'pressure-heatmap' | 'vision-radar';
  players?: Player[];
  shots?: ShotEvent[];
  passLinks?: PassLink[];
  trackingPoints?: TrackingPoint[];
  homeColor?: string;
  awayColor?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  selectedPlayerId?: string | null;
  onSelectPlayer?: (player: Player) => void;
  showHalfSpaces?: boolean;
  showZone14?: boolean;
  className?: string;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  mode,
  players = [],
  shots = [],
  passLinks = [],
  trackingPoints = [],
  homeColor = '#38BDF8',
  awayColor = '#F43F5E',
  homeTeamName = 'Home',
  awayTeamName = 'Away',
  selectedPlayerId,
  onSelectPlayer,
  showHalfSpaces = true,
  showZone14 = true,
  className = '',
}) => {
  const [hoveredShot, setHoveredShot] = useState<ShotEvent | null>(null);
  const [hoveredPlayer, setHoveredPlayer] = useState<Player | null>(null);

  return (
    <div className={`relative w-full aspect-[105/68] bg-[#0c1810] rounded-xl overflow-hidden border border-emerald-900/60 shadow-2xl select-none ${className}`}>
      {/* Pitch Grass Texture & Patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b12] to-[#07130b] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_10%,rgba(255,255,255,0.04)_10%,rgba(255,255,255,0.04)_20%)]" />

      {/* SVG Pitch Marking Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 68"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="zone14Grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.28)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.04)" />
          </radialGradient>
          <radialGradient id="halfSpaceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.16)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.02)" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Pitch Outlines */}
        <rect x="2" y="2" width="96" height="64" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Halfway Line */}
        <line x1="50" y1="2" x2="50" y2="66" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        {/* Center Circle */}
        <circle cx="50" cy="34" r="9.15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        <circle cx="50" cy="34" r="0.6" fill="rgba(255,255,255,0.5)" />

        {/* Left Penalty Area (Home Defense) */}
        <rect x="2" y="14" width="16.5" height="40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        <rect x="2" y="24" width="5.5" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="11" cy="34" r="0.5" fill="rgba(255,255,255,0.5)" />
        <path d="M 18.5 27.5 A 9.15 9.15 0 0 1 18.5 40.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />

        {/* Right Penalty Area (Away Defense / Attack Zone) */}
        <rect x="81.5" y="14" width="16.5" height="40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
        <rect x="92.5" y="24" width="5.5" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="89" cy="34" r="0.5" fill="rgba(255,255,255,0.5)" />
        <path d="M 81.5 27.5 A 9.15 9.15 0 0 0 81.5 40.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />

        {/* Corner Arcs */}
        <path d="M 3 2 A 1 1 0 0 0 2 3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
        <path d="M 97 2 A 1 1 0 0 1 98 3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
        <path d="M 2 65 A 1 1 0 0 0 3 66" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
        <path d="M 98 65 A 1 1 0 0 1 97 66" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />

        {/* Tactical Zones: Half Spaces */}
        {showHalfSpaces && (
          <>
            {/* Top Half Space */}
            <rect x="18.5" y="14" width="63" height="10" fill="url(#halfSpaceGrad)" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.2" strokeDasharray="1,1" />
            {/* Bottom Half Space */}
            <rect x="18.5" y="44" width="63" height="10" fill="url(#halfSpaceGrad)" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.2" strokeDasharray="1,1" />
            <text x="68" y="19" fill="rgba(56, 189, 248, 0.4)" fontSize="2" fontWeight="bold">SOL YARIM ALAN (HALF-SPACE)</text>
            <text x="68" y="49" fill="rgba(56, 189, 248, 0.4)" fontSize="2" fontWeight="bold">SAĞ YARIM ALAN (HALF-SPACE)</text>
          </>
        )}

        {/* Tactical Zones: Zone 14 */}
        {showZone14 && (
          <>
            <rect x="65" y="24" width="16.5" height="20" fill="url(#zone14Grad)" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.3" strokeDasharray="1,1" />
            <text x="73.2" y="34.5" textAnchor="middle" fill="rgba(245, 158, 11, 0.7)" fontSize="2.2" fontWeight="bold" letterSpacing="0.1">ZONE 14 (ALTIN KORİDOR)</text>
          </>
        )}

        {/* PASS NETWORK MODE */}
        {mode === 'pass-network' && (
          <g>
            {/* Pass Links */}
            {passLinks.map((link, idx) => {
              // Convert 0-100 coordinates to pitch 100x68
              const px1 = (link.x1 * 96) / 100 + 2;
              const py1 = (link.y1 * 64) / 100 + 2;
              const px2 = (link.x2 * 96) / 100 + 2;
              const py2 = (link.y2 * 64) / 100 + 2;
              const strokeWidth = Math.max(0.4, Math.min(2.2, link.count / 14));
              const strokeColor = link.threatScore > 0.8 ? '#F59E0B' : '#38BDF8';

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={px1}
                    y1={py1}
                    x2={px2}
                    y2={py2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.65}
                    strokeLinecap="round"
                  />
                  {link.count > 15 && (
                    <circle
                      cx={(px1 + px2) / 2}
                      cy={(py1 + py2) / 2}
                      r="1"
                      fill="#0f172a"
                      stroke={strokeColor}
                      strokeWidth="0.3"
                    />
                  )}
                </g>
              );
            })}

            {/* Players */}
            {players.map((player) => {
              const px = (player.x * 96) / 100 + 2;
              const py = (player.y * 64) / 100 + 2;
              const isSelected = selectedPlayerId === player.id;
              const isHome = player.teamId === 'home';
              const pColor = isHome ? homeColor : awayColor;
              const nodeRadius = Math.max(2.2, Math.min(4.2, player.passesCompleted / 30 + 1.8));

              return (
                <g
                  key={player.id}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => onSelectPlayer && onSelectPlayer(player)}
                  onMouseEnter={() => setHoveredPlayer(player)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                >
                  {/* Halo if selected or important */}
                  {(isSelected || player.roleBadge) && (
                    <circle
                      cx={px}
                      cy={py}
                      r={nodeRadius + 1.6}
                      fill="none"
                      stroke={isSelected ? '#FACC15' : pColor}
                      strokeWidth="0.5"
                      strokeDasharray="1,1"
                      filter="url(#glow)"
                    />
                  )}
                  {/* Main Node */}
                  <circle
                    cx={px}
                    cy={py}
                    r={nodeRadius}
                    fill={pColor}
                    stroke="#0f172a"
                    strokeWidth="0.6"
                  />
                  {/* Player Number */}
                  <text
                    x={px}
                    y={py + 0.8}
                    textAnchor="middle"
                    fill={isHome ? '#0f172a' : '#0f172a'}
                    fontSize="1.9"
                    fontWeight="bold"
                  >
                    {player.number}
                  </text>
                  {/* Player Name Label */}
                  <text
                    x={px}
                    y={py + nodeRadius + 2.5}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="1.7"
                    fontWeight="600"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {player.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* XG SHOTS MODE */}
        {mode === 'xg-shots' && (
          <g>
            {shots.map((shot) => {
              const sx = (shot.x * 96) / 100 + 2;
              const sy = (shot.y * 64) / 100 + 2;
              // Size proportional to xG
              const radius = Math.max(1.4, Math.min(5.5, Math.sqrt(shot.xG) * 4.8 + 1.2));
              const isGoal = shot.result === 'Goal';
              const fillColor =
                shot.result === 'Goal'
                  ? '#22C55E'
                  : shot.result === 'Saved'
                  ? '#38BDF8'
                  : shot.result === 'Blocked'
                  ? '#F59E0B'
                  : '#94A3B8';

              return (
                <g
                  key={shot.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredShot(shot)}
                  onMouseLeave={() => setHoveredShot(null)}
                >
                  {/* Goal Star/Pulse */}
                  {isGoal && (
                    <circle
                      cx={sx}
                      cy={sy}
                      r={radius + 1.8}
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="0.6"
                      strokeDasharray="1,1"
                      filter="url(#glow)"
                    />
                  )}
                  {/* Shot Circle */}
                  <circle
                    cx={sx}
                    cy={sy}
                    r={radius}
                    fill={fillColor}
                    stroke="#ffffff"
                    strokeWidth={isGoal ? 0.8 : 0.4}
                    fillOpacity={0.85}
                  />
                  {/* Shooter Initials / xG text */}
                  {radius > 2.8 && (
                    <text
                      x={sx}
                      y={sy + 0.7}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="1.8"
                      fontWeight="bold"
                    >
                      {shot.xG.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* VISION RADAR MODE (2D Computer Vision Tracking Synchronized) */}
        {mode === 'vision-radar' && (
          <g>
            {trackingPoints.map((pt) => {
              const rx = (pt.radarX * 96) / 100 + 2;
              const ry = (pt.radarY * 64) / 100 + 2;
              const isBall = pt.type === 'ball';
              const isHome = pt.type === 'player_home';
              const color = isBall ? '#FACC15' : isHome ? homeColor : awayColor;

              return (
                <g key={pt.id} className="transition-all duration-300">
                  {pt.highlight && (
                    <circle
                      cx={rx}
                      cy={ry}
                      r="4"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.5"
                      strokeDasharray="1,1"
                      filter="url(#glow)"
                    />
                  )}
                  <circle
                    cx={rx}
                    cy={ry}
                    r={isBall ? 1.4 : 2.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                  />
                  {!isBall && pt.number && (
                    <text
                      x={rx}
                      y={ry + 0.7}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize="1.8"
                      fontWeight="bold"
                    >
                      {pt.number}
                    </text>
                  )}
                  {!isBall && pt.name && (
                    <text
                      x={rx}
                      y={ry + 4.2}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="1.5"
                      fontWeight="600"
                    >
                      {pt.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Floating Tactical Legends */}
      <div className="absolute top-2 left-3 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: homeColor }} />
          <span className="text-slate-200 font-semibold">{homeTeamName}</span>
        </div>
        <span className="text-slate-600">vs</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: awayColor }} />
          <span className="text-slate-200 font-semibold">{awayTeamName}</span>
        </div>
      </div>

      {/* Mode Specific Overlay Legend */}
      <div className="absolute bottom-2 right-3 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
        {mode === 'pass-network' && (
          <>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Dairesel Boyut: Pas Hacmi
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-0.5 bg-amber-400" /> Kalın Çizgi: Kilit Pas Bağı
            </span>
          </>
        )}
        {mode === 'xg-shots' && (
          <>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Gol
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Kurtarış
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Blok
            </span>
          </>
        )}
        {mode === 'vision-radar' && (
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            ● 2D Homografi Kuşbakışı Takip Aktif (30 FPS)
          </span>
        )}
      </div>

      {/* Hover Shot Tooltip */}
      {hoveredShot && (
        <div className="absolute top-3 right-3 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs max-w-xs z-20 pointer-events-none">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-white text-sm">{hoveredShot.player}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              hoveredShot.result === 'Goal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
            }`}>
              {hoveredShot.result} ({hoveredShot.minute}')
            </span>
          </div>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span className="text-slate-400">Beklenen Gol (xG):</span>
              <span className="font-mono font-bold text-amber-400">{hoveredShot.xG.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Hücum Türü:</span>
              <span className="text-white">{hoveredShot.shotType}</span>
            </p>
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
              "{hoveredShot.description}"
            </p>
          </div>
        </div>
      )}

      {/* Hover Player Tooltip */}
      {hoveredPlayer && (
        <div className="absolute top-3 right-3 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs max-w-xs z-20 pointer-events-none">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <div>
              <span className="font-bold text-white text-sm">#{hoveredPlayer.number} {hoveredPlayer.name}</span>
              <span className="ml-2 text-slate-400">({hoveredPlayer.position})</span>
            </div>
            {hoveredPlayer.roleBadge && (
              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[10px] font-medium">
                {hoveredPlayer.roleBadge}
              </span>
            )}
          </div>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span className="text-slate-400">İsabetli Pas:</span>
              <span className="font-mono text-white">{hoveredPlayer.passesCompleted} (%{hoveredPlayer.passAccuracy})</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Pres Girişimi:</span>
              <span className="font-mono text-white">{hoveredPlayer.pressureEvents}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Mesafe (km):</span>
              <span className="font-mono text-emerald-400">{hoveredPlayer.distanceCoveredKm} km</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
