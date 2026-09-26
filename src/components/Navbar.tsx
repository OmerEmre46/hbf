import React from 'react';
import {
  Database,
  Eye,
  Sparkles,
  Film,
  BookOpen,
  Radio,
  FileCode,
  ShieldAlert,
} from 'lucide-react';

export type ActiveModule = 'data_engine' | 'vision_tracking' | 'storytelling' | 'video_composer' | 'architecture';

interface NavbarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  matchTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  onSelectModule,
  matchTitle,
}) => {
  const navItems = [
    {
      id: 'data_engine' as ActiveModule,
      label: '1. Veri & Taktik Analiz',
      icon: Database,
      badge: 'StatsBomb',
      color: 'hover:text-emerald-400',
    },
    {
      id: 'vision_tracking' as ActiveModule,
      label: '2. Bilgisayarlı Görü (CV)',
      icon: Eye,
      badge: 'YOLOv11',
      color: 'hover:text-sky-400',
    },
    {
      id: 'storytelling' as ActiveModule,
      label: '3. HBF Senaryo Motoru',
      icon: Sparkles,
      badge: 'Gemini 3.8',
      color: 'hover:text-amber-400',
    },
    {
      id: 'video_composer' as ActiveModule,
      label: '4. Otomatik Kurgu',
      icon: Film,
      badge: 'FFmpeg',
      color: 'hover:text-purple-400',
    },
    {
      id: 'architecture' as ActiveModule,
      label: 'Mimari & Python Kodları',
      icon: FileCode,
      badge: 'Docs',
      color: 'hover:text-indigo-400',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-sky-600 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white tracking-tight text-sm sm:text-base">
                  TacticalVision <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  HBF STUDIO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                {matchTitle}
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                      : `text-slate-400 hover:text-slate-200 hover:bg-slate-800/40`
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-slate-700 text-slate-300' : 'bg-slate-800/80 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick Engine Status & Help */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Pipeline: Aktif</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
