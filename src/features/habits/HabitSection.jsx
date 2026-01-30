import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { Plus, X, RotateCcw, Layout as LayoutIcon, Check } from 'lucide-react';

export default function HabitSection() {
  const [habits, setHabits] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', color: '#3D2B1F' });
  const daysShort = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  useEffect(() => { setHabits(storage.getHabits()); }, []);

  const toggleDay = (habitId, dayIndex) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, days: newDays };
      }
      return h;
    });
    setHabits(updated);
    storage.saveHabits(updated);
  };

  const addNewHabit = () => {
    if (!newHabit.name) return;
    const habit = { id: Date.now().toString(), name: newHabit.name, color: newHabit.color, days: [false, false, false, false, false, false, false] };
    const updated = [...habits, habit];
    setHabits(updated);
    storage.saveHabits(updated);
    setNewHabit({ name: '', color: '#3D2B1F' });
  };

  const startNewWeek = () => {
    if (!window.confirm("Начать новую неделю?")) return;
    const cleared = habits.map(h => ({ ...h, days: [false, false, false, false, false, false, false] }));
    setHabits(cleared);
    storage.saveHabits(cleared);
  };

  return (
    <div className="p-2 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl md:text-3xl font-black text-[#3D2B1F]">Привычки</h2>
        <button onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all text-xs md:text-sm ${
            isEditMode ? 'bg-[#3D2B1F] text-white' : 'bg-white text-[#3D2B1F] border border-stone-100 shadow-sm'
          }`}>
          <LayoutIcon size={16}/> {isEditMode ? 'Готово' : 'Макет'}
        </button>
      </div>

      {isEditMode && (
        <div className="bg-white p-4 md:p-6 rounded-[32px] shadow-sm border border-stone-50 space-y-4 mx-2">
          <div className="flex flex-col md:flex-row gap-3">
            <input type="text" placeholder="Название..." className="flex-1 p-3 bg-stone-50 rounded-xl outline-none font-bold text-[#3D2B1F] text-sm" value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} />
            <div className="flex gap-2">
              <input type="color" className="w-12 h-12 rounded-xl border-none cursor-pointer bg-stone-50 p-1" value={newHabit.color} onChange={e => setNewHabit({...newHabit, color: e.target.value})} />
              <button onClick={addNewHabit} className="flex-1 bg-[#3D2B1F] text-white px-6 rounded-xl font-black text-xs uppercase">Добавить</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {habits.map(h => (
              <div key={h.id} className="flex items-center gap-2 pl-3 pr-1 py-1 bg-stone-50 rounded-full border border-stone-100">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: h.color}} />
                <span className="text-[10px] font-black text-[#3D2B1F] uppercase">{h.name}</span>
                <button onClick={() => { const updated = habits.filter(x => x.id !== h.id); setHabits(updated); storage.saveHabits(updated); }} className="text-stone-300 p-1"><X size={12}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ТАБЛИЦА: Без горизонтального скролла на мобилке */}
      <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-stone-50 p-3 md:p-8">
        
        {/* Заголовки: адаптивная сетка */}
        <div className="grid grid-cols-[80px_1fr] md:grid-cols-[150px_1fr] items-center mb-4 pb-2 border-b border-stone-50">
          <div className="text-[9px] font-black text-stone-300 uppercase tracking-widest pl-1">Привычка</div>
          <div className="grid grid-cols-7 w-full">
            {daysShort.map(d => (
              <div key={d} className="text-center text-[9px] font-black text-stone-300 uppercase tracking-widest">{d}</div>
            ))}
          </div>
        </div>

        {/* Строки привычек */}
        <div className="space-y-4 md:space-y-6">
          {habits.map(habit => (
            <div key={habit.id} className="grid grid-cols-[80px_1fr] md:grid-cols-[150px_1fr] items-center group">
              
              {/* Название привычки */}
              <div className="pr-2">
                <div className="font-black text-[#3D2B1F] text-[11px] md:text-sm truncate leading-none uppercase tracking-tighter">
                  {habit.name}
                </div>
              </div>

              {/* Кружочки: распределяются по всей ширине */}
              <div className="grid grid-cols-7 w-full gap-1">
                {habit.days.map((isDone, dayIndex) => (
                  <div key={dayIndex} className="flex justify-center">
                    <button
                      onClick={() => toggleDay(habit.id, dayIndex)}
                      className={`
                        w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                        ${isDone ? 'border-transparent scale-110 shadow-md' : 'border-stone-50 bg-stone-50'}
                      `}
                      style={{ 
                        backgroundColor: isDone ? habit.color : '',
                        boxShadow: isDone ? `0 4px 10px ${habit.color}44` : ''
                      }}
                    >
                      {isDone && <Check size={14} className="text-white md:hidden stroke-[4px]" />}
                      {isDone && <Check size={20} className="text-white hidden md:block stroke-[4px]" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="text-center py-10 text-stone-300 font-bold uppercase text-[10px] tracking-[0.2em]">Пусто</div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={startNewWeek}
          className="flex items-center gap-2 px-8 py-4 bg-[#3D2B1F] text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-xl active:scale-95"
        >
          <RotateCcw size={16} /> Новая неделя
        </button>
      </div>
    </div>
  );
}