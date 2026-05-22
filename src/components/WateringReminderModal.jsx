import React, { useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { WATERING_FREQUENCY_OPTIONS, parseWaterFrequencyDays, saveWateringSchedule } from '../lib/wateringReminders';

const WateringReminderModal = ({ open, onClose, user, plants = [], defaultFrequency, orderId = null, onSaved }) => {
  const firstPlantId = plants[0]?.id || plants[0]?.product_id || '';
  const [selectedPlantId, setSelectedPlantId] = useState(firstPlantId);
  const [frequencyDays, setFrequencyDays] = useState(parseWaterFrequencyDays(defaultFrequency));
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (plants[0]) {
      setSelectedPlantId(plants[0].id || plants[0].product_id || '');
      setFrequencyDays(parseWaterFrequencyDays(plants[0].water_frequency || defaultFrequency));
    }
  }, [defaultFrequency, plants]);

  const selectedPlant = useMemo(() => {
    return plants.find((plant) => String(plant.id || plant.product_id) === String(selectedPlantId)) || plants[0];
  }, [plants, selectedPlantId]);

  const frequencyOptions = useMemo(() => {
    if (WATERING_FREQUENCY_OPTIONS.some((option) => Number(option.days) === Number(frequencyDays))) {
      return WATERING_FREQUENCY_OPTIONS;
    }
    return [
      ...WATERING_FREQUENCY_OPTIONS,
      { label: `Every ${frequencyDays} days`, days: frequencyDays },
    ].sort((a, b) => a.days - b.days);
  }, [frequencyDays]);

  const plantName = selectedPlant?.name || selectedPlant?.product_name || selectedPlant?.plant_name || selectedPlant?.product_name_snapshot || 'this plant';

  const handleSave = async () => {
    if (!user) {
      setError('Please log in to save plant reminders.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const saved = await saveWateringSchedule({
        userId: user.id,
        plant: selectedPlant,
        frequencyDays,
        emailNotifications,
        orderId,
      });
      onSaved?.(saved);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save watering reminder.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F3A3A]/55 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          <Motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-[100] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 bg-[#FBF9F4] border border-[#B0B0A8]/30 shadow-2xl p-7 sm:p-9"
          >
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <p className="font-label text-[9px] tracking-[0.18em] uppercase text-[#785A1A] font-black mb-3">
                  Watering Reminder
                </p>
                <h2 className="font-headline text-[34px] leading-none text-[#1A1A1A]">
                  How often does {plantName} need watering?
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="material-symbols-outlined text-[#1A1A1A]/45 hover:text-[#1A1A1A] transition-colors"
              >
                close
              </button>
            </div>

            {plants.length > 1 && (
              <label className="block mb-7">
                <span className="block font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-bold mb-2">
                  Purchased plant
                </span>
                <select
                  value={selectedPlantId}
                  onChange={(event) => setSelectedPlantId(event.target.value)}
                  className="w-full bg-white border border-[#B0B0A8]/40 px-4 py-3 font-body text-[14px] outline-none focus:border-[#1A1A1A]"
                >
                  {plants.map((plant) => (
                    <option key={plant.id || plant.product_id || plant.product_name} value={plant.id || plant.product_id}>
                      {plant.name || plant.product_name || plant.product_name_snapshot}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block mb-7">
              <span className="block font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-bold mb-2">
                Watering frequency
              </span>
              <select
                value={frequencyDays}
                onChange={(event) => setFrequencyDays(Number(event.target.value))}
                className="w-full bg-white border border-[#B0B0A8]/40 px-4 py-3 font-body text-[14px] outline-none focus:border-[#1A1A1A]"
              >
                {frequencyOptions.map((option) => (
                  <option key={`${option.days}-${option.label}`} value={option.days}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="flex items-start gap-3 bg-white border border-[#B0B0A8]/20 p-4 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(event) => setEmailNotifications(event.target.checked)}
                className="mt-1 accent-[#0F3A3A]"
              />
              <span>
                <span className="block font-label text-[10px] tracking-[0.12em] uppercase text-[#1A1A1A] font-bold">
                  Email me at 8am on watering day
                </span>
                <span className="block font-body text-[12px] leading-relaxed text-[#5E6058] mt-1">
                  In-app reminders still appear in your notification bell.
                </span>
              </span>
            </label>

            {error && (
              <p className="mb-5 bg-[#FAF2F2] border border-[#D94F4F]/20 px-4 py-3 font-body text-[12px] text-[#9F403D]">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedPlant}
              className="w-full bg-[#0F3A3A] text-[#FBF9F4] py-4 font-label text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#1A2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving Schedule...' : 'Save Reminder'}
            </button>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WateringReminderModal;
