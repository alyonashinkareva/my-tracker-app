import React, { useState } from 'react';
import { User, Flame, Target, Trophy, Edit2, Check } from 'lucide-react';

export default function HomeSection({ userName, onUpdateName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    onUpdateName(tempName);
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 bg-stone-100 rounded-[45px] flex items-center justify-center border-4 border-white shadow-xl text-[#3D2B1F] relative">
          <User size={64} />
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-md text-[#3D2B1F]">
             <Trophy size={16} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 bg-white p-2 pl-4 rounded-2xl shadow-sm border border-stone-100 animate-in zoom-in-95">
              <input autoFocus type="text" className="bg-transparent outline-none font-black text-2xl text-[#3D2B1F] uppercase tracking-tighter w-40"
                value={tempName} onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} />
              <button onClick={handleSave} className="bg-[#3D2B1F] text-white p-2 rounded-xl"><Check size={20} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsEditing(true)}>
              <h2 className="text-4xl font-black text-[#3D2B1F] uppercase tracking-tighter">{userName}</h2>
              <Edit2 size={18} className="text-stone-300 group-hover:text-[#3D2B1F] transition-colors" />
            </div>
          )}
          <p className="text-stone-400 font-black tracking-[0.2em] uppercase text-[10px]">Личный прогресс</p>
        </div>
      </div>

      

      
    </div>
  );
}