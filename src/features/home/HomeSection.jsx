import React from 'react';
import { User, Flame, Target, Trophy } from 'lucide-react';

export default function HomeSection() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 bg-stone-100 rounded-[40px] flex items-center justify-center border-4 border-white shadow-xl text-[#3D2B1F]">
          <User size={64} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#3D2B1F]">Алёна</h2>
          <p className="text-stone-400 font-medium tracking-wide uppercase text-[10px]">Личный профиль</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Flame />, label: 'Дней подряд', val: '12', color: 'text-orange-600 bg-orange-50' },
          { icon: <Trophy />, label: 'Тренировки', val: '4', color: 'text-yellow-600 bg-yellow-50' },
          { icon: <Target />, label: 'Кг за месяц', val: '-1.5', color: 'text-[#3D2B1F] bg-stone-100' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-black text-[#3D2B1F]">{s.val}</div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#3D2B1F] p-8 rounded-[40px] text-white shadow-2xl shadow-stone-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Сегодня день тренировки!</h3>
          <p className="text-stone-300 text-sm">Твое тело скажет тебе спасибо после жима штанги.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Trophy size={150} />
        </div>
      </div>
    </div>
  );
}