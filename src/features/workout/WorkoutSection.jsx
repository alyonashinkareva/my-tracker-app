import React, { useState, useEffect, useMemo } from 'react';
import { storage } from '../../utils/storage';
import { Plus, ChevronLeft, ChevronRight, History, X, Trash2, Edit3, BookOpen } from 'lucide-react';

export default function WorkoutSection() {
  const [screen, setScreen] = useState('calendar');
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [library, setLibrary] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingWorkout, setViewingWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentWorkout, setCurrentWorkout] = useState({
    id: Date.now(), name: '', date: new Date().toISOString().split('T')[0], categoryId: '', exercises: []
  });

  // Загрузка данных при старте
  useEffect(() => {
    setWorkouts(storage.getWorkouts());
    setCategories(storage.getCategories());
    setLibrary(storage.getLibrary());
    setPlans(storage.getPlans());

    // 1. ПРОВЕРКА ЧЕРНОВИКА
    const draft = storage.getDraft();
    if (draft && draft.exercises.length > 0) {
      if (confirm("У вас есть незаконченная тренировка. Продолжить?")) {
        setCurrentWorkout(draft);
        setScreen('workout');
      } else {
        storage.clearDraft();
      }
    }
  }, []);

  // 2. АВТОСОХРАНЕНИЕ ЧЕРНОВИКА
  useEffect(() => {
    if (screen === 'workout' && !isEditing) {
      storage.saveDraft(currentWorkout);
    }
  }, [currentWorkout, screen, isEditing]);

  const { days, firstDayIndex } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dCount = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days: new Array(dCount).fill(0).map((_, i) => i + 1), firstDayIndex: firstDay === 0 ? 6 : firstDay - 1 };
  }, [selectedDate]);

  const getWorkoutForDay = (day) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(w => w.date === dateStr);
  };

  const saveFullWorkout = () => {
    if (!currentWorkout.categoryId) return alert("Выберите группу мышц");
    
    let updatedWorkouts;
    if (isEditing) {
      updatedWorkouts = workouts.map(w => w.id === currentWorkout.id ? currentWorkout : w);
    } else {
      updatedWorkouts = [currentWorkout, ...workouts];
    }

    setWorkouts(updatedWorkouts);
    storage.saveWorkouts(updatedWorkouts);
    storage.clearDraft();
    setIsEditing(false);
    setScreen('calendar');
    setCurrentWorkout({ id: Date.now(), name: '', date: new Date().toISOString().split('T')[0], categoryId: '', exercises: [] });
  };

  const startFromPlan = (plan) => {
    const newWorkout = {
      ...currentWorkout,
      name: plan.name,
      exercises: plan.exercises.map((exName, i) => ({
        id: Date.now() + i,
        name: exName,
        sets: [{ id: Date.now() + i + 100, weight: '', reps: '' }]
      }))
    };
    setCurrentWorkout(newWorkout);
    setScreen('workout');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
      {screen === 'calendar' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 text-[#3D2B1F]">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Тренировки</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}><ChevronLeft /></button>
              <span className="font-black uppercase text-xs tracking-widest min-w-[100px] text-center">{selectedDate.toLocaleString('default', { month: 'long' })}</span>
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}><ChevronRight /></button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-100">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[10px] font-black text-stone-300 uppercase tracking-widest">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array(firstDayIndex).fill(null).map((_, i) => <div key={i} />)}
              {days.map(day => {
                const workout = getWorkoutForDay(day);
                const cat = workout ? categories.find(c => c.id === workout.categoryId) : null;
                return (
                  <button key={day} onClick={() => { if(workout) { setViewingWorkout(workout); setScreen('details'); } }}
                    className={`h-11 md:h-16 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${workout ? 'text-white scale-105 shadow-md shadow-stone-200' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`} style={{ backgroundColor: cat?.color }}>{day}</button>
                );
              })}
            </div>
          </div>

          {/* МОИ ПЛАНЫ ДЛЯ БЫСТРОГО СТАРТА */}
          <div className="space-y-3">
             <h3 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] ml-2">Быстрый старт по плану</h3>
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button onClick={() => setScreen('workout')} className="shrink-0 bg-white p-4 rounded-3xl border border-dashed border-stone-200 text-stone-400 flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Plus size={16}/> Пустая</button>
                {plans.map(p => (
                  <button key={p.id} onClick={() => startFromPlan(p)} className="shrink-0 bg-white px-6 py-4 rounded-3xl border border-stone-100 text-[#3D2B1F] flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-sm hover:bg-stone-50"><BookOpen size={16}/> {p.name}</button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setScreen('history')} className="p-6 bg-white rounded-[32px] shadow-sm border text-[#3D2B1F] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"><History size={18} /> История</button>
            <button onClick={() => setScreen('workout')} className="p-6 bg-[#3D2B1F] text-white rounded-[32px] shadow-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"><Plus size={18} /> Начать пустую</button>
          </div>
        </div>
      )}

      {screen === 'workout' && (
        <WorkoutForm currentWorkout={currentWorkout} setCurrentWorkout={setCurrentWorkout} categories={categories} library={library} setLibrary={setLibrary} onBack={() => { storage.clearDraft(); setScreen('calendar'); setIsEditing(false); }} onSave={saveFullWorkout} isEditing={isEditing} />
      )}

      {screen === 'details' && viewingWorkout && (
        <div className="space-y-6 animate-in slide-in-from-right-8 px-2">
           <div className="flex justify-between items-center">
             <button onClick={() => setScreen('calendar')} className="text-stone-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Назад</button>
             <button onClick={() => { setCurrentWorkout(viewingWorkout); setIsEditing(true); setScreen('workout'); }} className="bg-[#3D2B1F] text-white p-3 px-6 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-200">
               <Edit3 size={16} /> Редактировать
             </button>
           </div>
           <div className="bg-white p-8 rounded-[45px] shadow-sm text-center border-t-[12px]" style={{borderColor: categories.find(c => c.id === viewingWorkout.categoryId)?.color}}>
              <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">{categories.find(c => c.id === viewingWorkout.categoryId)?.name}</div>
              <h2 className="text-4xl font-black text-[#3D2B1F] uppercase tracking-tighter leading-none mb-2">{viewingWorkout.name || "Тренировка"}</h2>
              <p className="text-stone-400 font-black text-sm">{viewingWorkout.date}</p>
           </div>
           <div className="space-y-4 pb-20">
             {viewingWorkout.exercises.map(ex => (
               <div key={ex.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-50">
                  <h4 className="font-black text-xl text-[#3D2B1F] mb-4 border-b border-stone-50 pb-3 uppercase tracking-tighter">{ex.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ex.sets.map((s, i) => (
                      <div key={i} className="bg-stone-50 p-4 rounded-2xl flex justify-between items-center text-sm font-bold">
                        <span className="text-stone-300 uppercase text-[9px]">Set {i+1}</span>
                        <span className="text-[#3D2B1F]">{s.weight}кг × {s.reps}</span>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}

// Форма записи
function WorkoutForm({ currentWorkout, setCurrentWorkout, categories, library, setLibrary, onBack, onSave, isEditing }) {
  const [showExModal, setShowExModal] = useState(false);
  const [search, setSearch] = useState('');

  const updateSet = (exId, setId, field, value) => {
    setCurrentWorkout(prev => ({
      ...prev, exercises: prev.exercises.map(ex => ex.id === exId ? {
        ...ex, sets: ex.sets.map(s => s.id === setId ? {...s, [field]: value} : s)
      } : ex)
    }));
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto px-2">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-30">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm text-[#3D2B1F]"><X /></button>
        <h2 className="font-black text-2xl text-[#3D2B1F] uppercase tracking-tighter text-center flex-1">{isEditing ? 'Правка' : 'Запись'}</h2>
        <button onClick={onSave} className="p-4 bg-[#3D2B1F] text-white rounded-2xl shadow-xl font-black px-10 active:scale-95 transition-all text-[10px] uppercase tracking-widest">Готово</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-50 space-y-6">
          <input type="text" placeholder="НАЗВАНИЕ ТРЕНИРОВКИ" className="w-full text-2xl font-black outline-none text-[#3D2B1F] placeholder:text-stone-100 uppercase tracking-tighter" value={currentWorkout.name} onChange={e => setCurrentWorkout({...currentWorkout, name: e.target.value})} />
          <div className="flex flex-col sm:flex-row gap-8 justify-between">
            <input type="date" className="bg-stone-50 p-4 rounded-2xl font-black text-xs text-[#3D2B1F]" value={currentWorkout.date} onChange={e => setCurrentWorkout({...currentWorkout, date: e.target.value})} />
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c.id} onClick={() => setCurrentWorkout({...currentWorkout, categoryId: c.id})} 
                  className={`w-10 h-10 rounded-full border-4 transition-all ${currentWorkout.categoryId === c.id ? 'border-[#3D2B1F] scale-110 shadow-lg' : 'border-transparent opacity-20'}`} 
                  style={{ backgroundColor: c.color }} />
              ))}
            </div>
          </div>
        </div>

        {currentWorkout.exercises.map((ex, idx) => (
          <div key={ex.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-[#3D2B1F] uppercase text-base tracking-tight">{idx + 1}. {ex.name}</h4>
              <button onClick={() => setCurrentWorkout({...currentWorkout, exercises: currentWorkout.exercises.filter(e => e.id !== ex.id)})} className="text-stone-200 hover:text-red-400 p-2"><Trash2 size={20}/></button>
            </div>
            <div className="space-y-3">
              {ex.sets.map((set, i) => (
                <div key={set.id} className="flex gap-3 items-center">
                  <span className="text-stone-300 font-black text-[10px] w-6 uppercase">Set {i+1}</span>
                  <input type="number" placeholder="кг" className="w-full bg-stone-50 p-4 rounded-2xl text-center font-black text-[#3D2B1F] outline-none" value={set.weight} onChange={e => updateSet(ex.id, set.id, 'weight', e.target.value)} />
                  <input type="number" placeholder="повт" className="w-full bg-stone-50 p-4 rounded-2xl text-center font-black text-[#3D2B1F] outline-none" value={set.reps} onChange={e => updateSet(ex.id, set.id, 'reps', e.target.value)} />
                </div>
              ))}
              <button onClick={() => {
                const last = ex.sets[ex.sets.length - 1];
                setCurrentWorkout({...currentWorkout, exercises: currentWorkout.exercises.map(e => e.id === ex.id ? {...e, sets: [...e.sets, { id: Date.now(), weight: last.weight, reps: last.reps }]} : e)});
              }} className="w-full py-4 bg-stone-50 text-stone-300 text-[10px] font-black rounded-2xl uppercase tracking-widest">+ ПОДХОД</button>
            </div>
          </div>
        ))}
        <button onClick={() => setShowExModal(true)} className="w-full py-16 bg-white border-4 border-dashed border-stone-100 rounded-[45px] text-stone-200 font-black uppercase text-xs tracking-[0.5em]">+ УПРАЖНЕНИЕ</button>
      </div>

      {showExModal && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[50px] md:rounded-[50px] p-10 h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-20">
            <div className="flex justify-between items-center mb-8"><h3 className="font-black text-3xl text-[#3D2B1F] uppercase tracking-tighter">Выбор</h3><button onClick={() => setShowExModal(false)} className="p-3 bg-stone-50 rounded-full text-[#3D2B1F]"><X /></button></div>
            <input type="text" placeholder="ПОИСК..." className="w-full p-6 bg-stone-50 rounded-3xl font-black mb-6 outline-none text-[#3D2B1F]" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {library.filter(l => l.toLowerCase().includes(search.toLowerCase())).map(l => (
                <button key={l} onClick={() => {
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: l, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-6 bg-stone-50 hover:bg-stone-100 rounded-2xl font-black text-[#3D2B1F] uppercase text-xs tracking-widest">{l}</button>
              ))}
              {search && !library.includes(search) && (
                <button onClick={() => {
                  const updated = [...library, search]; setLibrary(updated); storage.saveLibrary(updated);
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: search, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-8 bg-[#3D2B1F] text-white rounded-[35px] font-black italic">Создать "{search.toUpperCase()}"</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}