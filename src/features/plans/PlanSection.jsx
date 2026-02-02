import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { Plus, Trash2, X, BookOpen, ChevronRight } from 'lucide-react';

export default function PlanSection() {
  const [plans, setPlans] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', exercises: [] });
  const [tempEx, setTempEx] = useState('');
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    setPlans(storage.getPlans());
    setLibrary(storage.getLibrary());
  }, []);

  const savePlan = () => {
    if (!newPlan.name || newPlan.exercises.length === 0) return alert("Заполните название и упражнения");
    const updated = [...plans, { ...newPlan, id: Date.now() }];
    setPlans(updated);
    storage.savePlans(updated);
    setIsAdding(false);
    setNewPlan({ name: '', exercises: [] });
  };

  const deletePlan = (id) => {
    if (confirm("Удалить план?")) {
      const updated = plans.filter(p => p.id !== id);
      setPlans(updated);
      storage.savePlans(updated);
    }
  };

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-3xl font-black text-[#3D2B1F] uppercase tracking-tighter">Мои Планы</h2>
        <button onClick={() => setIsAdding(true)} className="bg-[#3D2B1F] text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      {isAdding ? (
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 space-y-6 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[#3D2B1F] uppercase tracking-widest text-xs">Создание шаблона</h3>
            <button onClick={() => setIsAdding(false)}><X /></button>
          </div>
          <input type="text" placeholder="НАЗВАНИЕ ПЛАНА (НАПР. НОГИ)" className="w-full text-2xl font-black outline-none text-[#3D2B1F] uppercase border-b-2 border-stone-50 pb-2" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="text" list="lib" placeholder="ДОБАВИТЬ УПРАЖНЕНИЕ" className="flex-1 bg-stone-50 p-4 rounded-2xl font-bold outline-none" value={tempEx} onChange={e => setTempEx(e.target.value)} />
              <datalist id="lib">{library.map(l => <option key={l} value={l} />)}</datalist>
              <button onClick={() => { if(tempEx) { setNewPlan({...newPlan, exercises: [...newPlan.exercises, tempEx]}); setTempEx(''); }}} className="bg-stone-100 p-4 rounded-2xl text-[#3D2B1F] font-black">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPlan.exercises.map((ex, i) => (
                <div key={i} className="bg-stone-100 px-4 py-2 rounded-full font-black text-[10px] text-[#3D2B1F] uppercase flex items-center gap-2">
                  {ex} <button onClick={() => setNewPlan({...newPlan, exercises: newPlan.exercises.filter((_, idx) => idx !== i)})}><X size={12}/></button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={savePlan} className="w-full bg-[#3D2B1F] text-white p-6 rounded-3xl font-black tracking-widest uppercase text-sm">Сохранить шаблон</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-50 group relative">
              <button onClick={() => deletePlan(plan.id)} className="absolute top-4 right-4 text-stone-200 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
              <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#3D2B1F] mb-4"><BookOpen size={24}/></div>
              <h3 className="text-xl font-black text-[#3D2B1F] uppercase tracking-tighter mb-2">{plan.name}</h3>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{plan.exercises.length} упражнений</div>
            </div>
          ))}
          {plans.length === 0 && <div className="col-span-full py-20 text-center text-stone-300 font-bold uppercase tracking-widest text-xs opacity-50">Шаблонов пока нет</div>}
        </div>
      )}
    </div>
  );
}