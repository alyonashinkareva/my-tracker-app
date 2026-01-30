import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { Plus, X, ChevronLeft, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MeasurementSection() {
  const [measurements, setMeasurements] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isAddModal, setIsAddModal] = useState(false);
  const [newMetricName, setNewMetricName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newValueDate, setNewValueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { setMeasurements(storage.getMeasurements()); }, []);

  const addMetric = () => {
    if (!newMetricName) return;
    const metric = { id: Date.now(), name: newMetricName, history: [] };
    const updated = [...measurements, metric];
    setMeasurements(updated);
    storage.saveMeasurements(updated);
    setNewMetricName('');
    setIsAddModal(false);
  };

  const addValue = (id) => {
    if (!newValue) return;
    const updated = measurements.map(m => {
      if (m.id === id) {
        return {
          ...m, history: [...m.history, { date: newValueDate, value: parseFloat(newValue) }].sort((a, b) => new Date(a.date) - new Date(b.date))
        };
      }
      return m;
    });
    setMeasurements(updated);
    storage.saveMeasurements(updated);
    setNewValue('');
    if (selectedMetric?.id === id) setSelectedMetric(updated.find(m => m.id === id));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#3D2B1F] uppercase tracking-tighter">Замеры</h2>
        <button onClick={() => setIsAddModal(true)} className="bg-[#3D2B1F] text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </div>

      {!selectedMetric ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {measurements.map(m => {
            const lastEntry = m.history[m.history.length - 1];
            return (
              <div key={m.id} onClick={() => setSelectedMetric(m)}
                className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-50 flex flex-col justify-center items-center text-center hover:border-[#3D2B1F] transition-all cursor-pointer aspect-square min-h-[150px]">
                <h3 className="text-2xl md:text-3xl font-black text-[#3D2B1F] leading-tight mb-1 uppercase tracking-tighter">{m.name}</h3>
                <div className="text-[10px] md:text-xs font-bold text-stone-300 uppercase tracking-widest">{lastEntry ? lastEntry.value : '--'}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <button onClick={() => setSelectedMetric(null)} className="flex items-center gap-2 text-stone-400 font-bold uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Назад</button>
          <div className="bg-white rounded-[45px] shadow-sm border border-stone-50 overflow-hidden">
            <div className="p-8 pb-0">
               <h3 className="text-4xl font-black text-[#3D2B1F] uppercase tracking-tighter">{selectedMetric.name}</h3>
               <p className="text-stone-300 font-bold uppercase tracking-widest text-[10px]">График прогресса</p>
            </div>
            <div className="bg-stone-50/50 m-6 rounded-[35px] p-6 md:p-10">
               <div className="h-[250px] md:h-[350px] w-full">
                {selectedMetric.history.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedMetric.history} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{fontSize: 10, fontWeight: '800', fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={15} interval={0} padding={{ left: 20, right: 20 }} />
                      <YAxis tick={{fontSize: 10, fontWeight: '800', fill: '#94a3b8'}} axisLine={false} tickLine={false} width={40} />
                      <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                      <Line type="monotone" dataKey="value" stroke="#3D2B1F" strokeWidth={5} dot={{r: 6, fill: '#3D2B1F', strokeWidth: 3, stroke: '#fff'}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-200 font-bold text-[10px] uppercase tracking-widest text-center">Нужно 2 замера</div>
                )}
               </div>
            </div>
            <div className="p-8 pt-0 space-y-4 flex flex-col md:flex-row gap-3">
              <input type="date" className="flex-1 p-5 bg-stone-50 rounded-2xl outline-none font-bold text-stone-700" value={newValueDate} onChange={e => setNewValueDate(e.target.value)} />
              <div className="flex-1 flex gap-2">
                <input type="number" placeholder="Значение" className="flex-1 p-5 bg-stone-50 rounded-2xl outline-none font-bold text-center text-xl text-[#3D2B1F]" value={newValue} onChange={e => setNewValue(e.target.value)} />
                <button onClick={() => addValue(selectedMetric.id)} className="bg-[#3D2B1F] text-white px-8 rounded-2xl font-black active:scale-95 transition-all">OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModal && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[50px] w-full max-w-sm space-y-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-center text-[#3D2B1F] uppercase tracking-tighter">Новый замер</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest ml-2">Название замера</label>
              <input type="text" placeholder="Напр: ВЕС" className="w-full p-6 bg-stone-50 rounded-[25px] outline-none font-black text-lg text-[#3D2B1F] focus:ring-4 focus:ring-stone-50 uppercase" value={newMetricName} onChange={(e) => setNewMetricName(e.target.value)} autoFocus />
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={addMetric} className="w-full bg-[#3D2B1F] text-white p-6 rounded-[25px] font-black text-lg shadow-xl shadow-stone-200 active:scale-95 transition-all">Создать</button>
              <button onClick={() => setIsAddModal(false)} className="text-stone-300 font-bold text-xs uppercase tracking-widest py-2">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}