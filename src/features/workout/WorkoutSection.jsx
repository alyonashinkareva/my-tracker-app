import React, { useState, useEffect, useMemo } from 'react';
import { storage } from '../../utils/storage';
import { Plus, ChevronLeft, ChevronRight, History, CheckCircle, X, Trash2 } from 'lucide-react';

export default function WorkoutSection() {
  const [screen, setScreen] = useState('calendar');
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingWorkout, setViewingWorkout] = useState(null);

  // Состояние для создания новой группы мышц
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3D2B1F');

  const [currentWorkout, setCurrentWorkout] = useState({
    id: Date.now(),
    name: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    exercises: []
  });

  useEffect(() => {
    setWorkouts(storage.getWorkouts());
    setCategories(storage.getCategories());
    setLibrary(storage.getLibrary());
  }, []);

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

  const addCategory = () => {
    if (!newCatName) return;
    const newCat = { id: Date.now().toString(), name: newCatName, color: newCatColor };
    const updated = [...categories, newCat];
    setCategories(updated);
    storage.saveCategories(updated);
    setNewCatName('');
    setIsAddingCat(false);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Удалить эту группу мышц?")) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      storage.saveCategories(updated);
    }
  };

  const saveFullWorkout = () => {
    if (!currentWorkout.categoryId) return alert("Выберите группу мышц (цвет)");
    const newWorkouts = [currentWorkout, ...workouts];
    setWorkouts(newWorkouts);
    storage.saveWorkouts(newWorkouts);
    setScreen('calendar');
    setCurrentWorkout({ id: Date.now(), name: '', date: new Date().toISOString().split('T')[0], categoryId: '', exercises: [] });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      
      {screen === 'calendar' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h2 className="text-2xl font-black text-[#3D2B1F]">Календарь</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}><ChevronLeft /></button>
              <span className="font-bold text-[#3D2B1F] min-w-[100px] text-center">{selectedDate.toLocaleString('default', { month: 'long' })}</span>
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}><ChevronRight /></button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
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
                    className={`h-12 md:h-16 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm transition-all
                    ${workout ? 'text-white scale-105 shadow-md' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
                    style={{ backgroundColor: cat?.color }}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* БЛОК УПРАВЛЕНИЯ ГРУППАМИ МЫШЦ (КАТЕГОРИЯМИ) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-stone-300 uppercase text-[10px] tracking-widest">Мои группы мышц</h3>
              <button onClick={() => setIsAddingCat(!isAddingCat)} className="text-[#3D2B1F] hover:rotate-90 transition-transform"><Plus size={20}/></button>
            </div>
            {isAddingCat && (
              <div className="flex gap-3 p-3 bg-stone-50 rounded-2xl animate-in slide-in-from-top-2">
                <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} className="w-10 h-10 rounded-xl border-none bg-transparent cursor-pointer" />
                <input type="text" placeholder="Название..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="flex-1 bg-transparent outline-none font-bold text-[#3D2B1F]" />
                <button onClick={addCategory} className="bg-[#3D2B1F] text-white px-6 rounded-xl font-bold text-xs uppercase">ОК</button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white text-[10px] font-black shadow-sm" style={{ backgroundColor: c.color }}>
                  {c.name}
                  <button onClick={() => deleteCategory(c.id)} className="hover:scale-125 transition-transform"><X size={12}/></button>
                </div>
              ))}
              {categories.length === 0 && !isAddingCat && <p className="text-stone-300 text-[10px] font-bold">Добавьте группу мышц (напр. Спина), чтобы начать</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button onClick={() => setScreen('history')} className="p-6 bg-white rounded-3xl shadow-sm border text-[#3D2B1F] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-stone-50 transition">
              <History size={18} /> История
            </button>
            <button onClick={() => setScreen('workout')} className="p-6 bg-[#3D2B1F] text-white rounded-3xl shadow-lg flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-stone-800 transition shadow-stone-200">
              <Plus size={18} /> Начать тренировку
            </button>
          </div>
        </div>
      )}

      {screen === 'workout' && (
        <WorkoutForm currentWorkout={currentWorkout} setCurrentWorkout={setCurrentWorkout} categories={categories} library={library} setLibrary={setLibrary} onBack={() => setScreen('calendar')} onSave={saveFullWorkout} />
      )}

      {screen === 'details' && viewingWorkout && (
        <div className="space-y-6 animate-in fade-in">
           <button onClick={() => setScreen('calendar')} className="text-stone-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Назад</button>
           <div className="bg-white p-8 rounded-[40px] shadow-sm text-center border-t-8" style={{borderColor: categories.find(c => c.id === viewingWorkout.categoryId)?.color}}>
              <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">{categories.find(c => c.id === viewingWorkout.categoryId)?.name}</div>
              <h2 className="text-3xl font-black text-[#3D2B1F] uppercase tracking-tighter">{viewingWorkout.name || "Тренировка"}</h2>
              <p className="text-stone-400 font-bold">{viewingWorkout.date}</p>
           </div>
           <div className="space-y-4">
             {viewingWorkout.exercises.map(ex => (
               <div key={ex.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-50">
                  <h4 className="font-black text-lg text-[#3D2B1F] mb-4 border-b border-stone-50 pb-2">{ex.name}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {ex.sets.map((s, i) => (
                      <div key={i} className="bg-stone-50 p-3 rounded-xl flex justify-between items-center text-sm">
                        <span className="text-stone-300 font-black text-[10px] uppercase">Set {i+1}</span>
                        <span className="font-black text-[#3D2B1F]">{s.weight}кг × {s.reps}</span>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
           <button onClick={() => {
              if(window.confirm("Удалить эту тренировку?")) {
                const updated = workouts.filter(w => w.id !== viewingWorkout.id);
                setWorkouts(updated);
                storage.saveWorkouts(updated);
                setScreen('calendar');
              }
           }} className="w-full text-stone-300 hover:text-red-400 font-bold text-xs uppercase tracking-widest py-10">Удалить запись</button>
        </div>
      )}

      {screen === 'history' && (
        <div className="space-y-6">
          <button onClick={() => setScreen('calendar')} className="text-stone-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Назад</button>
          <h2 className="text-2xl font-black text-[#3D2B1F] uppercase tracking-tighter">Вся история</h2>
          <div className="space-y-3">
            {workouts.map(w => (
              <div key={w.id} onClick={() => { setViewingWorkout(w); setScreen('details'); }}
                className="bg-white p-5 rounded-3xl shadow-sm border-l-[12px] flex justify-between items-center hover:scale-[1.02] transition-transform cursor-pointer"
                style={{ borderLeftColor: categories.find(c => c.id === w.categoryId)?.color }}>
                <div>
                  <div className="font-black text-[#3D2B1F] text-lg">{w.name || "Тренировка"}</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{w.date} • {w.exercises.length} упр.</div>
                </div>
                <ChevronRight className="text-stone-200" />
              </div>
            ))}
            {workouts.length === 0 && <div className="text-center py-20 text-stone-300 font-bold uppercase text-xs tracking-widest">История пуста</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// Форма записи (отдельный компонент)
function WorkoutForm({ currentWorkout, setCurrentWorkout, categories, library, setLibrary, onBack, onSave }) {
  const [showExModal, setShowExModal] = useState(false);
  const [search, setSearch] = useState('');

  const addSet = (exId) => {
    setCurrentWorkout(prev => ({
      ...prev, exercises: prev.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { id: Date.now(), weight: last?.weight || '', reps: last?.reps || '' }] };
      })
    }));
  };

  const updateSet = (exId, setId, field, value) => {
    setCurrentWorkout(prev => ({
      ...prev, exercises: prev.exercises.map(ex => ex.id === exId ? {
        ...ex, sets: ex.sets.map(s => s.id === setId ? {...s, [field]: value} : s)
      } : ex)
    }));
  };

  return (
    <div className="pb-20 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm text-[#3D2B1F]"><X /></button>
        <h2 className="font-black text-xl text-[#3D2B1F] uppercase tracking-tighter">Запись</h2>
        <button onClick={onSave} className="p-3 bg-[#3D2B1F] text-white rounded-2xl shadow-lg font-black px-8 active:scale-95 transition-transform uppercase text-xs tracking-widest">Готово</button>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6 border border-stone-50">
          <input type="text" placeholder="Название тренировки" className="w-full text-2xl font-black outline-none text-[#3D2B1F] placeholder:text-stone-200 uppercase tracking-tighter" value={currentWorkout.name} onChange={e => setCurrentWorkout({...currentWorkout, name: e.target.value})} />
          
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Дата заезда</label>
              <input type="date" className="bg-stone-50 p-3 rounded-xl font-black text-xs text-[#3D2B1F] outline-none block" value={currentWorkout.date} onChange={e => setCurrentWorkout({...currentWorkout, date: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Группа мышц</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCurrentWorkout({...currentWorkout, categoryId: c.id})} 
                    className={`w-8 h-8 rounded-full border-4 transition-all ${currentWorkout.categoryId === c.id ? 'border-stone-100 scale-110 shadow-lg' : 'border-transparent opacity-30'}`} 
                    style={{ backgroundColor: c.color }} 
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {currentWorkout.exercises.map((ex, idx) => (
          <div key={ex.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-[#3D2B1F] uppercase text-sm tracking-tight">{idx + 1}. {ex.name}</h4>
              <button onClick={() => setCurrentWorkout({...currentWorkout, exercises: currentWorkout.exercises.filter(e => e.id !== ex.id)})} className="text-stone-200 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
            </div>
            <div className="space-y-3">
              {ex.sets.map((set, i) => (
                <div key={set.id} className="flex gap-2 items-center">
                  <span className="text-stone-300 font-black text-[10px] w-4">{i+1}</span>
                  <input type="number" placeholder="кг" className="w-full bg-stone-50 p-3 rounded-2xl text-center font-black text-[#3D2B1F] outline-none focus:ring-2 focus:ring-stone-100" value={set.weight} onChange={e => updateSet(ex.id, set.id, 'weight', e.target.value)} />
                  <input type="number" placeholder="повт" className="w-full bg-stone-50 p-3 rounded-2xl text-center font-black text-[#3D2B1F] outline-none focus:ring-2 focus:ring-stone-100" value={set.reps} onChange={e => updateSet(ex.id, set.id, 'reps', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addSet(ex.id)} className="w-full py-3 bg-stone-50 text-stone-300 text-[10px] font-black rounded-2xl hover:text-[#3D2B1F] transition-colors uppercase tracking-widest">+ ПОДХОД</button>
            </div>
          </div>
        ))}

        <button onClick={() => setShowExModal(true)} className="w-full py-10 bg-white border-4 border-dashed border-stone-100 rounded-[32px] text-stone-200 font-black hover:text-[#3D2B1F] hover:border-stone-200 transition-all uppercase text-xs tracking-[0.3em]">+ ДОБАВИТЬ УПРАЖНЕНИЕ</button>
      </div>

      {showExModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] md:rounded-[40px] p-8 h-[70vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-2xl text-[#3D2B1F] uppercase tracking-tighter">Упражнение</h3>
              <button onClick={() => setShowExModal(false)} className="p-2 bg-stone-50 rounded-full text-[#3D2B1F]"><X /></button>
            </div>
            <input type="text" placeholder="Поиск..." className="w-full p-5 bg-stone-50 rounded-2xl font-black mb-4 outline-none text-[#3D2B1F] uppercase text-sm tracking-tight" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {library.filter(l => l.toLowerCase().includes(search.toLowerCase())).map(l => (
                <button key={l} onClick={() => {
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: l, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-5 bg-stone-50 hover:bg-stone-100 rounded-2xl font-black text-[#3D2B1F] uppercase text-xs transition-colors">{l}</button>
              ))}
              {search && !library.includes(search) && (
                <button onClick={() => {
                  const updated = [...library, search];
                  setLibrary(updated);
                  storage.saveLibrary(updated);
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: search, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-6 bg-[#3D2B1F] text-white rounded-3xl font-black italic shadow-lg shadow-stone-200">Создать "{search.toUpperCase()}"</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}