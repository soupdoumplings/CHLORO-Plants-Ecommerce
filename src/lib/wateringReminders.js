import { supabase } from '../supabase';
import { normalizeAppImageUrl } from './localImages';

export const WATERING_FREQUENCY_OPTIONS = [
  { label: 'Every 12 hours', days: 0.5, hours: 12 },
  { label: 'Every day', days: 1, hours: 24 },
  { label: 'Every 3 days', days: 3 },
  { label: 'Every 5 days', days: 5 },
  { label: 'Every 7 days', days: 7 },
  { label: 'Every 10 days', days: 10 },
  { label: 'Every 14 days', days: 14 },
  { label: 'Every 21 days', days: 21 },
];

const toDateOnly = (date) => date.toISOString().slice(0, 10);

export const parseWaterFrequencyDays = (frequency, fallback = 7) => {
  if (typeof frequency === 'number' && Number.isFinite(frequency)) return Math.max(0.5, frequency);

  const normalized = String(frequency || '').toLowerCase();
  const explicitNumber = normalized.match(/\d+/)?.[0];

  if (normalized.includes('12') && normalized.includes('hour')) return 0.5;
  if (normalized.includes('hour')) return 0.5;
  if (explicitNumber) return Math.max(1, Number(explicitNumber));
  if (normalized.includes('daily')) return 1;
  if (normalized.includes('every day')) return 1;
  if (normalized.includes('biweekly')) return 14;
  if (normalized.includes('weekly')) return 7;
  if (normalized.includes('month')) return 30;

  return fallback;
};

export const parseWaterFrequencyHours = (frequency, fallback = 168) => {
  const days = parseWaterFrequencyDays(frequency, fallback / 24);
  return Math.max(12, Math.round(days * 24));
};

export const getNextWateringDate = (frequencyDays, fromDate = new Date()) => {
  const nextDate = new Date(fromDate);
  nextDate.setHours(12, 0, 0, 0);
  nextDate.setTime(nextDate.getTime() + parseWaterFrequencyHours(frequencyDays) * 60 * 60 * 1000);
  return toDateOnly(nextDate);
};

export const getNextWateringAt = (frequencyDays, fromDate = new Date()) => {
  const nextDate = new Date(fromDate);
  nextDate.setTime(nextDate.getTime() + parseWaterFrequencyHours(frequencyDays) * 60 * 60 * 1000);
  return nextDate.toISOString();
};

export const getTodayDate = () => toDateOnly(new Date());

export const getPlantReminderPayload = ({ userId, plant, frequencyDays, emailNotifications, orderId = null }) => {
  const days = parseWaterFrequencyDays(frequencyDays);
  const hours = parseWaterFrequencyHours(frequencyDays);
  const productId = plant?.product_id || plant?.id || null;
  const plantName = plant?.plant_name || plant?.product_name || plant?.product_name_snapshot || plant?.name || 'Plant';
  const plantImage = normalizeAppImageUrl(
    plant?.plant_image || plant?.product_image_snapshot || plant?.image || plant?.images?.[0],
    null
  );

  return {
    user_id: userId,
    product_id: productId,
    order_id: orderId,
    plant_name: plantName,
    plant_image: plantImage,
    water_frequency_days: Math.max(1, Math.ceil(days)),
    water_frequency_hours: hours,
    last_watered_at: getTodayDate(),
    next_watering_date: getNextWateringDate(days),
    next_watering_at: getNextWateringAt(days),
    email_notifications: emailNotifications,
  };
};

export const saveWateringSchedule = async ({ userId, plant, frequencyDays, emailNotifications = true, orderId = null }) => {
  const payload = getPlantReminderPayload({ userId, plant, frequencyDays, emailNotifications, orderId });

  const savePayload = (schedulePayload) => supabase
    .from('user_plants')
    .upsert(schedulePayload, { onConflict: 'user_id,product_id' })
    .select()
    .single();

  const { data, error } = await savePayload(payload);
  if (!error) return data;

  const isMissingModernWateringColumn = /next_watering_at|water_frequency_hours|last_reminder_sent_at_ts|schema cache|column/i.test(error.message || '');
  if (!isMissingModernWateringColumn) throw error;

  const {
    next_watering_at: _nextWateringAt,
    water_frequency_hours: _waterFrequencyHours,
    last_reminder_sent_at_ts: _lastReminderSentAtTs,
    ...legacyPayload
  } = payload;
  const { data: legacyData, error: legacyError } = await savePayload(legacyPayload);

  if (legacyError) throw legacyError;
  return legacyData;
};

export const fetchUserPlants = async (userId) => {
  const { data, error } = await supabase
    .from('user_plants')
    .select('*')
    .eq('user_id', userId)
    .order('next_watering_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const markPlantWatered = async (plant) => {
  const frequencyDays = plant.water_frequency_hours
    ? Number(plant.water_frequency_hours) / 24
    : parseWaterFrequencyDays(plant.water_frequency_days);
  const modernPatch = {
    last_watered_at: getTodayDate(),
    next_watering_at: getNextWateringAt(frequencyDays),
    next_watering_date: getNextWateringDate(frequencyDays),
    last_reminder_sent_at: null,
    last_reminder_sent_at_ts: null,
  };
  const legacyPatch = {
    last_watered_at: modernPatch.last_watered_at,
    next_watering_date: modernPatch.next_watering_date,
    last_reminder_sent_at: modernPatch.last_reminder_sent_at,
  };
  const dateOnlyPatch = {
    last_watered_at: modernPatch.last_watered_at,
    next_watering_date: modernPatch.next_watering_date,
  };
  const wateredOnlyPatch = {
    last_watered_at: modernPatch.last_watered_at,
  };
  const updatePlant = (patch) => supabase
      .from('user_plants')
      .update(patch)
      .eq('id', plant.id)
      .select()
      .single();

  let lastError = null;
  for (const attempt of [modernPatch, legacyPatch, dateOnlyPatch, wateredOnlyPatch]) {
    const { data, error } = await updatePlant(attempt);

    if (!error) {
      return {
        ...plant,
        ...data,
        ...attempt,
      };
    }

    lastError = error;
  }

  throw lastError;
};

export const setEmailNotifications = async (plantId, enabled) => {
  const { data, error } = await supabase
    .from('user_plants')
    .update({ email_notifications: enabled })
    .eq('id', plantId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
