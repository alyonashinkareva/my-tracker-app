import React, { useState } from 'react';
import { Layout, Dumbbell, CheckSquare, TrendingUp, Menu, X, Home } from 'lucide-react';
import HomeSection from './features/home/HomeSection';
import WorkoutSection from './features/workout/WorkoutSection';
import HabitSection from './features/habits/HabitSection';
import MeasurementSection from './features/measurements/MeasurementSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'home', name: 'Главная', icon: <Home size={22}/> },
    { id: 'workout', name: 'Тренировки', icon: <Dumbbell size={22}/> },
    { id: 'habits', name: 'Привычки', icon: <CheckSquare size={22}/> },
    { id: 'measurements', name: 'Замеры', icon: <TrendingUp size={22}/> },
  ];

  const handleLogoClick = () => {
    setActiveTab('home');
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-stone-900">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r border-stone-100 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="p-8 cursor-pointer group" onClick={handleLogoClick}>
          <h1 className="text-3xl font-black text-[#3D2B1F] flex items-center gap-2 tracking-tighter transition-transform active:scale-95">
            <Layout fill="currentColor" /> My Tracker
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-black transition-all
                ${activeTab === item.id 
                  ? 'bg-[#3D2B1F] text-white shadow-xl shadow-stone-200 scale-[1.02]' 
                  : 'text-stone-400 hover:bg-stone-50 hover:text-[#3D2B1F]'}
              `}
            >
              {item.icon} <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-white border-b p-5 flex justify-between items-center sticky top-0 z-50">
          <h1 className="font-black text-xl text-[#3D2B1F] cursor-pointer" onClick={handleLogoClick}>My Tracker</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-stone-50 rounded-2xl text-[#3D2B1F]">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && <HomeSection />}
          {activeTab === 'workout' && <WorkoutSection />}
          {activeTab === 'habits' && <HabitSection />}
          {activeTab === 'measurements' && <MeasurementSection />}
        </main>
      </div>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] md:hidden" />}
    </div>
  );
}