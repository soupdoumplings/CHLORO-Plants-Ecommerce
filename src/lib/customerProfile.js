import { supabase } from '../supabase';

const missingRelationCodes = new Set(['42P01', 'PGRST205', 'PGRST200', '42703']);

export const emptyCustomerProfile = {
  username: '',
  full_name: '',
  phone: '',
  address_line: '',
  city: '',
  country: 'Nepal',
  postal_code: '',
};

export const emptyBillingDetails = {
  full_name: '',
  email: '',
  phone: '',
  address_line: '',
  city: '',
  country: 'Nepal',
  postal_code: '',
};

const isMissingSchemaError = (error) => (
  missingRelationCodes.has(error?.code)
  || /does not exist|could not find|schema cache/i.test(error?.message || '')
);

export const splitName = (name = '') => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
};

export const getAuthFullName = (user) => (
  user?.user_metadata?.full_name
  || user?.user_metadata?.name
  || user?.email?.split('@')?.[0]
  || ''
);

export const formatAddress = (address) => (
  [
    address?.addressLine || address?.address_line,
    address?.city,
    address?.country,
    address?.postalCode || address?.postal_code,
  ]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(', ')
);

export const isProfileComplete = ({ profile, billing }) => {
  const source = {
    ...emptyCustomerProfile,
    ...(profile || {}),
    phone: profile?.phone || billing?.phone || '',
    address_line: profile?.address_line || billing?.address_line || '',
    city: profile?.city || billing?.city || '',
    country: profile?.country || billing?.country || '',
  };

  return Boolean(
    source.full_name?.trim()
    && source.phone?.trim()
    && source.address_line?.trim()
    && source.city?.trim()
    && source.country?.trim()
  );
};

export const getCustomerProfile = async (user) => {
  if (!user?.id) return { profile: null, billing: null, schemaReady: false };

  const result = {
    profile: null,
    billing: null,
    schemaReady: true,
  };

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    result.profile = data;
  } catch (error) {
    if (isMissingSchemaError(error)) {
      result.schemaReady = false;
    } else {
      throw error;
    }
  }

  try {
    const { data, error } = await supabase
      .from('billing_details')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    result.billing = data;
  } catch (error) {
    if (isMissingSchemaError(error)) {
      result.schemaReady = false;
    } else {
      throw error;
    }
  }

  if (!result.profile) {
    try {
      const { data } = await supabase
        .from('users')
        .select('name, email, phone, address_line, city, country, postal_code, plant_preferences')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        result.profile = {
          user_id: user.id,
          username: data.name || getAuthFullName(user),
          full_name: data.name || getAuthFullName(user),
          phone: data.phone || user.user_metadata?.phone || '',
          address_line: data.address_line || '',
          city: data.city || '',
          country: data.country || 'Nepal',
          postal_code: data.postal_code || '',
          plant_preferences: data.plant_preferences || null,
        };
      }
    } catch {
      result.profile = {
        user_id: user.id,
        username: getAuthFullName(user),
        full_name: getAuthFullName(user),
        phone: user.user_metadata?.phone || '',
        country: 'Nepal',
      };
    }
  }

  if (!result.billing && result.profile) {
    result.billing = {
      user_id: user.id,
      full_name: result.profile.full_name || getAuthFullName(user),
      email: user.email || '',
      phone: result.profile.phone || '',
      address_line: result.profile.address_line || '',
      city: result.profile.city || '',
      country: result.profile.country || 'Nepal',
      postal_code: result.profile.postal_code || '',
    };
  }

  return result;
};

export const buildProfilePayload = ({ user, profile = {}, billing = {} }) => {
  const fullName = profile.full_name || billing.full_name || getAuthFullName(user);
  return {
    user_id: user.id,
    username: profile.username || fullName || user.email?.split('@')?.[0] || 'customer',
    full_name: fullName,
    phone: profile.phone || billing.phone || user.user_metadata?.phone || '',
    address_line: profile.address_line || billing.address_line || '',
    city: profile.city || billing.city || '',
    country: profile.country || billing.country || 'Nepal',
    postal_code: profile.postal_code || billing.postal_code || '',
    avatar_url: profile.avatar_url || null,
    onboarding_completed: true,
    profile_completed_at: new Date().toISOString(),
  };
};

export const buildBillingPayload = ({ user, profile = {}, billing = {} }) => {
  const profilePayload = buildProfilePayload({ user, profile, billing });
  return {
    user_id: user.id,
    full_name: billing.full_name || profilePayload.full_name,
    email: billing.email || user.email || '',
    phone: billing.phone || profilePayload.phone,
    address_line: billing.address_line || profilePayload.address_line,
    city: billing.city || profilePayload.city,
    country: billing.country || profilePayload.country,
    postal_code: billing.postal_code || profilePayload.postal_code,
    is_default: true,
  };
};

export const upsertCustomerProfile = async ({ user, profile, billing }) => {
  if (!user?.id) throw new Error('You must be signed in to save profile details.');

  const profilePayload = buildProfilePayload({ user, profile, billing });
  const billingPayload = buildBillingPayload({ user, profile: profilePayload, billing });

  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert(profilePayload, { onConflict: 'user_id' });

  if (profileError) throw profileError;

  const { error: billingError } = await supabase
    .from('billing_details')
    .upsert(billingPayload, { onConflict: 'user_id' });

  if (billingError) throw billingError;

  await supabase.auth.updateUser({
    data: {
      full_name: profilePayload.full_name,
      phone: profilePayload.phone,
      ...(profile.avatar_url ? { avatar_url: profile.avatar_url } : {}),
    },
  });

  const { error: usersError } = await supabase
    .from('users')
    .update({
      name: profilePayload.full_name,
      phone: profilePayload.phone,
      address_line: profilePayload.address_line,
      city: profilePayload.city,
      country: profilePayload.country,
      postal_code: profilePayload.postal_code,
    })
    .eq('id', user.id);

  if (usersError && !isMissingSchemaError(usersError)) {
    console.warn('Could not mirror profile onto users table:', usersError.message);
  }

  return { profile: profilePayload, billing: billingPayload };
};

export const saveCheckoutBillingDetails = async ({ user, checkoutDetails }) => {
  if (!user?.id) return { success: false, error: 'Missing user.' };

  const fullName = `${checkoutDetails.firstName || ''} ${checkoutDetails.lastName || ''}`.trim()
    || getAuthFullName(user);
  const sourceAddress = checkoutDetails.sameAsShipping
    ? checkoutDetails.shippingAddress
    : checkoutDetails.billingAddress;

  const profile = {
    full_name: fullName,
    phone: checkoutDetails.phone || user.user_metadata?.phone || '',
    address_line: checkoutDetails.shippingAddress?.addressLine || '',
    city: checkoutDetails.shippingAddress?.city || '',
    country: checkoutDetails.shippingAddress?.country || 'Nepal',
    postal_code: checkoutDetails.shippingAddress?.postalCode || '',
  };

  const billing = {
    full_name: fullName,
    email: checkoutDetails.email || user.email || '',
    phone: checkoutDetails.phone || '',
    address_line: sourceAddress?.addressLine || '',
    city: sourceAddress?.city || '',
    country: sourceAddress?.country || 'Nepal',
    postal_code: sourceAddress?.postalCode || '',
  };

  try {
    await upsertCustomerProfile({ user, profile, billing });
    return { success: true };
  } catch (error) {
    console.warn('Saved order but could not update saved billing details:', error.message);
    return { success: false, error: error.message };
  }
};

export const profileToCheckoutDetails = ({ user, profile, billing }) => {
  const fullName = billing?.full_name || profile?.full_name || getAuthFullName(user);
  const { firstName, lastName } = splitName(fullName);
  const shippingAddress = {
    addressLine: profile?.address_line || billing?.address_line || '',
    city: profile?.city || billing?.city || '',
    country: profile?.country || billing?.country || 'Nepal',
    postalCode: profile?.postal_code || billing?.postal_code || '',
  };
  const billingAddress = {
    addressLine: billing?.address_line || profile?.address_line || '',
    city: billing?.city || profile?.city || '',
    country: billing?.country || profile?.country || 'Nepal',
    postalCode: billing?.postal_code || profile?.postal_code || '',
  };

  return {
    email: billing?.email || user?.email || '',
    phone: billing?.phone || profile?.phone || user?.user_metadata?.phone || '',
    firstName,
    lastName,
    shippingAddress,
    billingAddress,
    sameAsShipping: formatAddress(shippingAddress) === formatAddress(billingAddress),
  };
};
