import React, { useState, useEffect, useMemo } from 'react';
import { storage } from '../../utils/storage';
import { Plus, ChevronLeft, ChevronRight, History, CheckCircle, X, Trash2, Dumbbell } from 'lucide-react';

export default function WorkoutSection() {
  const [screen, setScreen] = useState('calendar'); // 'calendar', 'workout', 'history', 'details'
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewingWorkout, setViewingWorkout] = useState(null);

  // Состояние для создания новой группы мышц
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3D2B1F');

  // Состояние новой тренировки
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

  // Логика календаря
  const { days, firstDayIndex } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dCount = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { 
      days: new Array(dCount).fill(0).map((_, i) => i + 1), 
      firstDayIndex: firstDay === 0 ? 6 : firstDay - 1 
    };
  }, [selectedDate]);

  const getWorkoutForDay = (day) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find(w => w.date === dateStr);
  };

  // Управление категориями
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
      
      {screen === 'calendar' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Шапка календаря */}
          <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
            <h2 className="text-2xl font-black text-[#3D2B1F] tracking-tighter uppercase">Тренировки</h2>
            <div className="flex items-center gap-4 bg-stone-50 p-1 rounded-2xl">
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="p-2 hover:text-[#3D2B1F]"><ChevronLeft size={20}/></button>
              <span className="font-black text-[#3D2B1F] text-xs uppercase tracking-widest min-w-[100px] text-center">
                {selectedDate.toLocaleString('default', { month: 'long' })}
              </span>
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="p-2 hover:text-[#3D2B1F]"><ChevronRight size={20}/></button>
            </div>
          </div>

          {/* Сетка календаря */}
          <div className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-100">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array(firstDayIndex).fill(null).map((_, i) => <div key={i} />)}
              {days.map(day => {
                const workout = getWorkoutForDay(day);
                const cat = workout ? categories.find(c => c.id === workout.categoryId) : null;
                return (
                  <button 
                    key={day} 
                    onClick={() => { if(workout) { setViewingWorkout(workout); setScreen('details'); } }}
                    className={`h-11 md:h-16 rounded-2xl flex items-center justify-center text-sm font-black transition-all
                    ${workout ? 'text-white scale-105 shadow-md shadow-stone-200' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
                    style={{ backgroundColor: cat?.color }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* НОВЫЙ БЛОК УПРАВЛЕНИЯ ГРУППАМИ МЫШЦ */}
          <div className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-100 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-stone-300 uppercase text-[10px] tracking-widest leading-none">Группы мышц</h3>
              <button 
                onClick={() => setIsAddingCat(!isAddingCat)} 
                className="text-[#3D2B1F] bg-stone-50 p-2 rounded-xl transition-transform active:scale-90"
              >
                {isAddingCat ? <X size={18}/> : <Plus size={18}/>}
              </button>
            </div>

            {isAddingCat && (
              <div className="p-5 bg-stone-50 rounded-[28px] border border-stone-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                {/* Выбор цвета */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-100">
                  <div className="relative w-12 h-12 shrink-0">
                    <input 
                      type="color" 
                      value={newCatColor} 
                      onChange={e => setNewCatColor(e.target.value)} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div 
                      className="w-full h-full rounded-xl shadow-inner border border-stone-200 flex items-center justify-center" 
                      style={{ backgroundColor: newCatColor }}
                    >
                      <Plus size={16} className="text-white mix-blend-difference opacity-50" />
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-stone-400 uppercase leading-tight tracking-wide">
                    Нажми на квадрат,<br/>чтобы выбрать цвет
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Название (напр. Спина)" 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  className="w-full bg-white p-4 rounded-2xl outline-none font-bold text-[#3D2B1F] border border-stone-100" 
                />
                
                <button 
                  onClick={addCategory} 
                  className="w-full bg-[#3D2B1F] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all"
                >
                  Создать группу
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map(c => (
                <div key={c.id} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-[10px] font-black shadow-sm" style={{ backgroundColor: c.color }}>
                  {c.name}
                  <button onClick={() => deleteCategory(c.id)} className="hover:opacity-60 transition-opacity"><X size={12}/></button>
                </div>
              ))}
              {categories.length === 0 && !isAddingCat && (
                <p className="text-stone-300 text-[10px] font-bold italic px-1 uppercase tracking-tighter opacity-70">
                  Сначала создайте группы мышц через "+"
                </p>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setScreen('history')} className="p-6 bg-white rounded-[32px] shadow-sm border border-stone-100 text-[#3D2B1F] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest">
              <History size={18} /> Вся История
            </button>
            <button onClick={() => setScreen('workout')} className="p-6 bg-[#3D2B1F] text-white rounded-[32px] shadow-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest active:scale-95 transition-transform shadow-stone-200">
              <Plus size={18} /> Начать тренировку
            </button>
          </div>
        </div>
      )}

      {screen === 'workout' && (
        <WorkoutForm 
          currentWorkout={currentWorkout} 
          setCurrentWorkout={setCurrentWorkout} 
          categories={categories} 
          library={library} 
          setLibrary={setLibrary} 
          onBack={() => setScreen('calendar')} 
          onSave={saveFullWorkout} 
        />
      )}

      {/* Экран деталей */}
      {screen === 'details' && viewingWorkout && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 px-2">
           <button onClick={() => setScreen('calendar')} className="text-stone-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Назад в календарь</button>
           <div className="bg-white p-8 rounded-[45px] shadow-sm text-center border-t-[12px]" style={{borderColor: categories.find(c => c.id === viewingWorkout.categoryId)?.color}}>
              <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">{categories.find(c => c.id === viewingWorkout.categoryId)?.name}</div>
              <h2 className="text-4xl font-black text-[#3D2B1F] uppercase tracking-tighter leading-none mb-2">{viewingWorkout.name || "Тренировка"}</h2>
              <p className="text-stone-400 font-black text-sm">{viewingWorkout.date}</p>
           </div>
           <div className="space-y-4">
             {viewingWorkout.exercises.map(ex => (
               <div key={ex.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-stone-50">
                  <h4 className="font-black text-xl text-[#3D2B1F] mb-4 border-b border-stone-50 pb-3">{ex.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ex.sets.map((s, i) => (
                      <div key={i} className="bg-stone-50 p-4 rounded-2xl flex justify-between items-center">
                        <span className="text-stone-300 font-black text-[10px] uppercase tracking-widest">Подход {i+1}</span>
                        <span className="font-black text-[#3D2B1F]">{s.weight}кг × {s.reps}</span>
                      </div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
           <button onClick={() => { if(window.confirm("Удалить эту тренировку?")) { const updated = workouts.filter(w => w.id !== viewingWorkout.id); setWorkouts(updated); storage.saveWorkouts(updated); setScreen('calendar'); } }}
             className="w-full text-stone-300 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.3em] py-10 transition-colors"
           >
             Удалить запись
           </button>
        </div>
      )}

      {screen === 'history' && (
        <div className="space-y-6 animate-in slide-in-from-left-8">
          <button onClick={() => setScreen('calendar')} className="text-stone-400 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest"><ChevronLeft size={16} /> Календарь</button>
          <h2 className="text-3xl font-black text-[#3D2B1F] uppercase tracking-tighter px-2">История</h2>
          <div className="space-y-3 px-2">
            {workouts.map(w => (
              <div key={w.id} onClick={() => { setViewingWorkout(w); setScreen('details'); }}
                className="bg-white p-6 rounded-[32px] shadow-sm border-l-[16px] flex justify-between items-center active:scale-95 transition-transform cursor-pointer"
                style={{ borderLeftColor: categories.find(c => c.id === w.categoryId)?.color }}>
                <div>
                  <div className="font-black text-[#3D2B1F] text-xl tracking-tight leading-none mb-1">{w.name || "Тренировка"}</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">{w.date} • {w.exercises.length} упр.</div>
                </div>
                <ChevronRight className="text-stone-200" />
              </div>
            ))}
            {workouts.length === 0 && <div className="text-center py-20 text-stone-300 font-bold uppercase text-xs tracking-widest italic opacity-50 px-10">Пока здесь ничего нет. Время потренироваться!</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ФОРМА ЗАПИСИ
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
    <div className="pb-24 animate-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto px-2">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/90 backdrop-blur-md py-4 z-30">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm text-[#3D2B1F] active:scale-90 transition-transform"><X /></button>
        <h2 className="font-black text-2xl text-[#3D2B1F] uppercase tracking-tighter">Запись</h2>
        <button onClick={onSave} className="p-4 bg-[#3D2B1F] text-white rounded-2xl shadow-xl font-black px-10 active:scale-95 transition-all uppercase text-[10px] tracking-widest">Готово</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm space-y-8 border border-stone-50">
          <input type="text" placeholder="НАЗВАНИЕ ТРЕНИРОВКИ" className="w-full text-3xl font-black outline-none text-[#3D2B1F] placeholder:text-stone-100 uppercase tracking-tighter" value={currentWorkout.name} onChange={e => setCurrentWorkout({...currentWorkout, name: e.target.value})} />
          
          <div className="flex flex-col sm:flex-row gap-8 justify-between items-start">
            <div className="space-y-2 w-full">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] ml-1">Дата</label>
              <input type="date" className="bg-stone-50 p-4 rounded-2xl font-black text-xs text-[#3D2B1F] outline-none block w-full border border-transparent focus:border-stone-100" value={currentWorkout.date} onChange={e => setCurrentWorkout({...currentWorkout, date: e.target.value})} />
            </div>
            
            <div className="space-y-3 w-full">
              <label className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] ml-1">Группа мышц</label>
              <div className="flex gap-2 flex-wrap p-2 bg-stone-50 rounded-[24px]">
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCurrentWorkout({...currentWorkout, categoryId: c.id})} 
                    className={`w-9 h-9 rounded-full border-4 transition-all ${currentWorkout.categoryId === c.id ? 'border-white scale-110 shadow-lg ring-2 ring-[#3D2B1F]/10' : 'border-transparent opacity-20 hover:opacity-50'}`} 
                    style={{ backgroundColor: c.color }} 
                    title={c.name}
                  />
                ))}
                {categories.length === 0 && <span className="text-[9px] font-black text-stone-300 uppercase p-2">Создайте группы в календаре</span>}
              </div>
            </div>
          </div>
        </div>

        {currentWorkout.exercises.map((ex, idx) => (
          <div key={ex.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-50 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-[#3D2B1F] uppercase text-base tracking-tight">{idx + 1}. {ex.name}</h4>
              <button onClick={() => setCurrentWorkout({...currentWorkout, exercises: currentWorkout.exercises.filter(e => e.id !== ex.id)})} className="text-stone-200 hover:text-red-400 p-2"><Trash2 size={20}/></button>
            </div>
            <div className="space-y-3">
              {ex.sets.map((set, i) => (
                <div key={set.id} className="flex gap-3 items-center">
                  <span className="text-stone-300 font-black text-[10px] w-6 uppercase">Set {i+1}</span>
                  <input type="number" placeholder="кг" className="w-full bg-stone-50 p-4 rounded-2xl text-center font-black text-[#3D2B1F] outline-none border border-transparent focus:border-stone-100 transition-all" value={set.weight} onChange={e => updateSet(ex.id, set.id, 'weight', e.target.value)} />
                  <input type="number" placeholder="повт" className="w-full bg-stone-50 p-4 rounded-2xl text-center font-black text-[#3D2B1F] outline-none border border-transparent focus:border-stone-100 transition-all" value={set.reps} onChange={e => updateSet(ex.id, set.id, 'reps', e.target.value)} />
                </div>
              ))}
              <button onClick={() => addSet(ex.id)} className="w-full py-4 mt-2 bg-stone-50 text-stone-300 text-[10px] font-black rounded-2xl hover:text-[#3D2B1F] transition-all uppercase tracking-[0.3em]">+ ПОДХОД</button>
            </div>
          </div>
        ))}

        <button onClick={() => setShowExModal(true)} className="w-full py-16 bg-white border-4 border-dashed border-stone-100 rounded-[45px] text-stone-200 font-black hover:text-[#3D2B1F] hover:border-[#3D2B1F]/20 transition-all uppercase text-xs tracking-[0.5em] active:scale-[0.99] shadow-inner">
          + УПРАЖНЕНИЕ
        </button>
      </div>

      {showExModal && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[50px] md:rounded-[50px] p-10 h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-3xl text-[#3D2B1F] uppercase tracking-tighter">Выбор</h3>
              <button onClick={() => setShowExModal(false)} className="p-3 bg-stone-50 rounded-full text-[#3D2B1F]"><X /></button>
            </div>
            <input 
              type="text" 
              placeholder="ПОИСК..." 
              className="w-full p-6 bg-stone-50 rounded-3xl font-black mb-6 outline-none text-[#3D2B1F] uppercase text-sm tracking-widest border border-transparent focus:border-stone-100" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              autoFocus 
            />
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {library.filter(l => l.toLowerCase().includes(search.toLowerCase())).map(l => (
                <button key={l} onClick={() => {
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: l, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-6 bg-stone-50 hover:bg-stone-100 rounded-2xl font-black text-[#3D2B1F] uppercase text-xs transition-colors tracking-widest">{l}</button>
              ))}
              {search && !library.includes(search) && (
                <button onClick={() => {
                  const updated = [...library, search];
                  setLibrary(updated);
                  storage.saveLibrary(updated);
                  setCurrentWorkout({...currentWorkout, exercises: [...currentWorkout.exercises, { id: Date.now(), name: search, sets: [{ id: Date.now()+1, weight: '', reps: '' }] }]});
                  setShowExModal(false);
                }} className="w-full text-left p-8 bg-[#3D2B1F] text-white rounded-[35px] font-black italic shadow-xl shadow-stone-200">Создать "{search.toUpperCase()}"</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}