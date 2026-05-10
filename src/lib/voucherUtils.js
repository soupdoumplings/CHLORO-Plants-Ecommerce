import { supabase } from '../supabase';

const VOUCHER_DISCOUNT = 500; // Fixed discount amount for now
const PLANTS_PER_VOUCHER = 5;

/**
 * Validates a voucher code and returns its discount amount if valid.
 */
export const validateVoucher = async (code, userId = null) => {
  if (!code) return { success: false, error: 'Voucher code is required' };

  try {
    let query = supabase
      .from('vouchers')
      .select('*')
      .eq('code', code)
      .eq('is_used', false);

    if (userId) {
       query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      // For local testing without Supabase configured correctly, check local storage
      const localVouchers = JSON.parse(localStorage.getItem('chloro_vouchers') || '[]');
      const localVoucher = localVouchers.find(v => v.code === code && !v.is_used && (userId ? v.userId === userId : true));
      
      if (localVoucher) {
        return { success: true, discount: localVoucher.discountAmount, voucherId: localVoucher.id || code };
      }

      return { success: false, error: 'Invalid or expired voucher code' };
    }

    return { success: true, discount: data.discount_amount, voucherId: data.id };
  } catch (err) {
    console.error('Error validating voucher:', err);
    return { success: false, error: 'Error validating voucher' };
  }
};

/**
 * Marks a voucher as used.
 */
export const markVoucherAsUsed = async (voucherIdOrCode) => {
  try {
    const { error } = await supabase
      .from('vouchers')
      .update({ is_used: true })
      .eq('id', voucherIdOrCode)
      .or(`code.eq.${voucherIdOrCode}`); // Allow matching by code as fallback

    if (error) {
       // Check local storage fallback
       let localVouchers = JSON.parse(localStorage.getItem('chloro_vouchers') || '[]');
       let found = false;
       localVouchers = localVouchers.map(v => {
         if (v.id === voucherIdOrCode || v.code === voucherIdOrCode) {
           found = true;
           return { ...v, is_used: true };
         }
         return v;
       });
       if (found) {
         localStorage.setItem('chloro_vouchers', JSON.stringify(localVouchers));
       }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error marking voucher as used:', err);
    return { success: false };
  }
};

/**
 * Checks the user's purchased plants count and awards a voucher if they reached the threshold.
 */
export const checkAndAwardVoucher = async (userId, newPlantsBought) => {
  if (!userId) {
     // Guest user logic: track in localStorage
     let guestPlants = parseInt(localStorage.getItem('chloro_guest_plants') || '0');
     let newGuestPlants = guestPlants + newPlantsBought;
     localStorage.setItem('chloro_guest_plants', newGuestPlants.toString());
     
     if (Math.floor(newGuestPlants / PLANTS_PER_VOUCHER) > Math.floor(guestPlants / PLANTS_PER_VOUCHER)) {
        return generateLocalVoucher(null);
     }
     return null;
  }

  try {
    // 1. Get current count
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('purchased_plants_count')
      .eq('id', userId)
      .single();

    if (userError) {
      console.warn("Could not fetch user plants count, trying local storage fallback for authenticated user");
      // Fallback
      let localPlants = parseInt(localStorage.getItem(`chloro_plants_${userId}`) || '0');
      let newTotal = localPlants + newPlantsBought;
      localStorage.setItem(`chloro_plants_${userId}`, newTotal.toString());
      if (Math.floor(newTotal / PLANTS_PER_VOUCHER) > Math.floor(localPlants / PLANTS_PER_VOUCHER)) {
        return generateLocalVoucher(userId);
      }
      return null;
    }

    const currentCount = userData?.purchased_plants_count || 0;
    const newTotal = currentCount + newPlantsBought;

    // 2. Update count
    await supabase
      .from('users')
      .update({ purchased_plants_count: newTotal })
      .eq('id', userId);

    // 3. Check if they crossed a multiple of 5
    if (Math.floor(newTotal / PLANTS_PER_VOUCHER) > Math.floor(currentCount / PLANTS_PER_VOUCHER)) {
      const code = `CHLORO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error: insertError } = await supabase
        .from('vouchers')
        .insert([{
          user_id: userId,
          code: code,
          discount_amount: VOUCHER_DISCOUNT,
          is_used: false
        }]);

      if (insertError) {
         console.warn("Failed to insert voucher to Supabase, saving locally");
         return generateLocalVoucher(userId, code);
      }
      
      return code;
    }

    return null;
  } catch (err) {
    console.error('Error checking and awarding voucher:', err);
    return null;
  }
};

const generateLocalVoucher = (userId, specificCode = null) => {
   const code = specificCode || `CHLORO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
   const localVouchers = JSON.parse(localStorage.getItem('chloro_vouchers') || '[]');
   localVouchers.push({
      id: `local_${Date.now()}`,
      userId: userId,
      code: code,
      discountAmount: VOUCHER_DISCOUNT,
      is_used: false,
      created_at: new Date().toISOString()
   });
   localStorage.setItem('chloro_vouchers', JSON.stringify(localVouchers));
   return code;
};
