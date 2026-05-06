import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../lib/AuthContext';
import { fetchUserPlants, markPlantWatered, setEmailNotifications } from '../../lib/wateringReminders';

const formatDate = (date) => {
  if (!date) return 'Not scheduled';
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-NP', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getWateringState = (plant) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const last = new Date(`${plant.last_watered_at || plant.created_at?.slice(0, 10)}T12:00:00`);
  const next = new Date(`${plant.next_watering_date}T12:00:00`);
  const total = Math.max(1, next - last);
  const elapsed = Math.max(0, today - last);
  const progress = Math.min(100, Math.round((elapsed / total) * 100));
  const overdue = today > next;
  const dueToday = today.toDateString() === next.toDateString();

  return { progress: overdue ? 100 : progress, overdue, dueToday };
};

const MyPlantsPage = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPlants = async () => {
      if (!user) return;

      setLoading(true);
      setError('');
      try {
        setPlants(await fetchUserPlants(user.id));
      } catch (err) {
        setError(err.message || 'Could not load watering schedules.');
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, [user]);

  const handleWatered = async (plant) => {
    const updated = await markPlantWatered(plant);
    setPlants((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const handleEmailToggle = async (plant, enabled) => {
    const updated = await setEmailNotifications(plant.id, enabled);
    setPlants((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-16 lg:pt-24 pb-24 mt-[82px]">
        <div className="mb-12">
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-[#785A1A] font-bold mb-4">
            Personal Care Calendar
          </p>
          <h1 className="font-headline text-[clamp(3rem,8vw,7rem)] leading-[0.85] text-[#1A1A1A]">
            My Plants
          </h1>
        </div>

        {loading && (
          <p className="font-label text-[11px] tracking-[0.18em] uppercase text-[#5E6058]">Loading watering schedules...</p>
        )}

        {error && (
          <p className="bg-[#FAF2F2] border border-[#D94F4F]/20 px-4 py-3 font-body text-[13px] text-[#9F403D]">{error}</p>
        )}

        {!loading && plants.length === 0 && (
          <div className="bg-white border border-[#B0B0A8]/20 p-10">
            <span className="material-symbols-outlined text-[34px] text-[#0F3A3A] mb-4 block">water_drop</span>
            <h2 className="font-headline text-3xl text-[#1A1A1A] mb-3">No watering schedules yet.</h2>
            <p className="font-body text-[#5E6058] max-w-lg">
              Open a plant in the catalogue and use the hydration schedule button to start reminders.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plants.map((plant) => {
            const state = getWateringState(plant);

            return (
              <Motion.article
                key={plant.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-[#B0B0A8]/20 p-6 sm:p-7 shadow-sm"
              >
                <div className="flex gap-5">
                  <div className="w-24 h-28 bg-[#EDEBE4] overflow-hidden shrink-0">
                    {plant.plant_image ? (
                      <img src={plant.plant_image} alt={plant.plant_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0F3A3A]/50">local_florist</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-headline text-2xl text-[#1A1A1A] leading-tight">{plant.plant_name}</h2>
                        <p className="font-label text-[9px] tracking-[0.14em] uppercase text-[#6B6B6B] mt-2">
                          Every {plant.water_frequency_days} days
                        </p>
                      </div>
                      <span className={`font-label text-[9px] tracking-[0.12em] uppercase px-2.5 py-1.5 ${state.overdue ? 'bg-[#D94F4F] text-white' : state.dueToday ? 'bg-[#C5A059] text-white' : 'bg-[#E8E9E0] text-[#0F3A3A]'}`}>
                        {state.overdue ? 'Overdue' : state.dueToday ? 'Due Today' : 'Scheduled'}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between font-label text-[9px] tracking-[0.12em] uppercase text-[#6B6B6B] mb-2">
                        <span>Next Watering</span>
                        <span>{formatDate(plant.next_watering_date)}</span>
                      </div>
                      <div className="h-2 bg-[#E8E9E0] overflow-hidden">
                        <div
                          className={`h-full ${state.overdue ? 'bg-[#D94F4F]' : 'bg-[#0F3A3A]'}`}
                          style={{ width: `${state.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#B0B0A8]/20 pt-5">
                  <label className="flex items-center gap-3 font-label text-[9px] tracking-[0.14em] uppercase text-[#4A4A4A] font-bold">
                    <input
                      type="checkbox"
                      checked={plant.email_notifications}
                      onChange={(event) => handleEmailToggle(plant, event.target.checked)}
                      className="accent-[#0F3A3A]"
                    />
                    Email reminders
                  </label>
                  <button
                    type="button"
                    onClick={() => handleWatered(plant)}
                    className="bg-[#0F3A3A] text-[#FBF9F4] px-6 py-3 font-label text-[10px] tracking-[0.16em] uppercase font-bold hover:bg-[#1A2F2F] transition-colors"
                  >
                    I Watered It
                  </button>
                </div>
              </Motion.article>
            );
          })}
        </div>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default MyPlantsPage;
