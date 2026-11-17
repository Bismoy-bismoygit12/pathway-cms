import React, { useState } from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, ArrowLeft } from 'lucide-react';

export const WeatherQuickExitPage: React.FC = () => {
  const [city, setCity] = useState<'dhaka' | 'chattogram' | 'sylhet'>('dhaka');

  const weatherData = {
    dhaka: { temp: '29°C', condition: 'Partly Sunny', humidity: '58%', wind: '9 km/h', feel: '31°C' },
    chattogram: { temp: '28°C', condition: 'Gentle Coastal Breeze', humidity: '64%', wind: '14 km/h', feel: '30°C' },
    sylhet: { temp: '26°C', condition: 'Mild Scattered Showers', humidity: '72%', wind: '7 km/h', feel: '27°C' }
  };

  const current = weatherData[city];

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-sky-200 pb-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg text-slate-900 tracking-tight">Bangladesh Weather Bulletin</span>
          </div>
          <span className="text-xs text-slate-500">Live Radar & Forecast</span>
        </header>

        {/* City Switcher */}
        <div className="flex gap-2 text-xs font-medium">
          <button
            onClick={() => setCity('dhaka')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              city === 'dhaka' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Dhaka
          </button>
          <button
            onClick={() => setCity('chattogram')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              city === 'chattogram' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Chattogram
          </button>
          <button
            onClick={() => setCity('sylhet')}
            className={`px-3 py-1.5 rounded-lg border transition ${
              city === 'sylhet' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Sylhet
          </button>
        </div>

        {/* Current Weather Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize text-slate-900">{city} Regional Observation</h2>
              <p className="text-sm text-slate-500">{current.condition}</p>
            </div>
            <Sun className="w-12 h-12 text-amber-500" />
          </div>

          <div className="text-5xl font-extrabold text-slate-900">{current.temp}</div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Humidity: {current.humidity}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Wind className="w-4 h-4 text-sky-500" />
              <span>Wind: {current.wind}</span>
            </div>
            <div className="text-slate-600">Feels like: {current.feel}</div>
          </div>
        </div>

        {/* Weekly Outlook */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm space-y-3">
          <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">3-Day Forecast</h3>
          <div className="divide-y divide-slate-100 text-xs text-slate-700">
            <div className="py-2.5 flex items-center justify-between">
              <span>Thursday</span>
              <span>29°C / 21°C</span>
              <span className="text-slate-500">Sunny</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span>Friday</span>
              <span>28°C / 20°C</span>
              <span className="text-slate-500">Passing clouds</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span>Saturday</span>
              <span>30°C / 22°C</span>
              <span className="text-slate-500">Clear sky</span>
            </div>
          </div>
        </div>

        {/* Return Button (discreetly placed at bottom) */}
        <div className="text-center pt-4">
          <a
            href="/"
            className="text-[11px] text-slate-400 hover:text-slate-600 underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Pathway portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};
