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

      

      
    </div>
  );
}