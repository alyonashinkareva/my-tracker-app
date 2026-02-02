import React, { useState, useEffect, useMemo } from 'react';
import { storage } from '../../utils/storage';
import { Plus, ChevronLeft, ChevronRight, Utensils, Save } from 'lucide-react';

export default function NutritionSection() {
  const [nutritionData, setNutritionData] = useState([]);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], kcal: '', p: '', f: '', c: '' });
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => { setNutritionData(storage.getNutrition()); }, []);

  const weekDays = useMemo(() => {
    const start = new Date(viewDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d.toISOString().split('T')[0];
    });
  }, [viewDate]);

  const handleSave = () => {
    if (!form.kcal) return alert("Введи Ккал");
    const updated = [...nutritionData.filter(d => d.date !== form.date), { ...form, kcal: Number(form.kcal), p: Number(form.p), f: Number(form.f), c: Number(form.c) }].sort((a, b) => new Date(b.date) - new Date(a.date));
    setNutritionData(updated); storage.saveNutrition(updated); setForm({ ...form, kcal: '', p: '', f: '', c: '' }); alert("Записано!");
  };

  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-4"><h2 className="text-3xl font-black text-[#3D2B1F] uppercase tracking-tighter">Питание и БЖУ</h2><Utensils size={28} className="text-[#3D2B1F]" /></div>

      <div className="bg-white p-10 rounded-[50px] shadow-sm border border-stone-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3"><label className="text-[10px] font-black text-stone-300 uppercase tracking-widest ml-1">Дата отчета</label><input type="date" className="w-full bg-stone-50 p-5 rounded-3xl font-black text-[#3D2B1F] outline-none border-2 border-transparent focus:border-stone-100" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div className="space-y-3"><label className="text-[10px] font-black text-stone-300 uppercase tracking-widest ml-1">Всего калорий</label><input type="number" placeholder="0 ккал" className="w-full bg-stone-50 p-5 rounded-3xl font-black text-[#3D2B1F] outline-none text-2xl" value={form.kcal} onChange={e => setForm({...form, kcal: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Белки', 'Жиры', 'Углеводы'].map((label, i) => {
            const key = ['p', 'f', 'c'][i];
            return <div key={key} className="space-y-2"><label className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center block">{label}</label><input type="number" placeholder="0г" className="w-full bg-stone-50 p-5 rounded-3xl font-black text-center text-[#3D2B1F] outline-none" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} /></div>
          })}
        </div>
        <button onClick={handleSave} className="w-full bg-[#3D2B1F] text-white p-8 rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all text-xs">Сохранить показатели</button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-6"><h3 className="font-black text-[#3D2B1F] uppercase tracking-tighter text-xl">Недельный отчет</h3><div className="flex gap-2"><button onClick={() => setViewDate(new Date(viewDate.setDate(viewDate.getDate() - 7)))} className="p-3 bg-white rounded-2xl shadow-sm"><ChevronLeft size={18}/></button><button onClick={() => setViewDate(new Date(viewDate.setDate(viewDate.getDate() + 7)))} className="p-3 bg-white rounded-2xl shadow-sm"><ChevronRight size={18}/></button></div></div>
        <div className="bg-white rounded-[50px] shadow-sm border border-stone-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead><tr className="bg-stone-50 text-[10px] font-black text-stone-400 uppercase tracking-widest"><th className="p-6 pl-10 text-[#3D2B1F]">День</th><th className="p-6 text-center">Ккал</th><th className="p-6 text-center">Бел</th><th className="p-6 text-center">Жир</th><th className="p-6 text-center">Угл</th></tr></thead>
            <tbody className="divide-y divide-stone-50">{weekDays.map(date => {
              const d = nutritionData.find(x => x.date === date);
              return <tr key={date} className="hover:bg-stone-50/50 transition-colors"><td className="p-6 pl-10"><div className="font-black text-[#3D2B1F] text-sm uppercase leading-none">{new Date(date).toLocaleString('ru-RU', { weekday: 'short' })}</div><div className="text-[10px] font-bold text-stone-300 mt-1">{date.split('-').slice(1).reverse().join('.')}</div></td><td className="p-6 text-center font-black text-[#3D2B1F] text-lg">{d?.kcal || '—'}</td><td className="p-6 text-center font-bold text-stone-400">{d?.p || '—'}</td><td className="p-6 text-center font-bold text-stone-400">{d?.f || '—'}</td><td className="p-6 text-center font-bold text-stone-400">{d?.c || '—'}</td></tr>
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}