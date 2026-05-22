/**
 * Payment gateway utilities for eSewa and Khalti.
 *
 * eSewa uses a hidden form POST redirect.
 * Khalti uses the ePayment initiate API and returns a hosted payment URL.
 */
import CryptoJS from 'crypto-js';

const ESEWA_CONFIG = {
  endpoint: import.meta.env.VITE_ESEWA_ENDPOINT || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  productCode: import.meta.env.VITE_ESEWA_PRODUCT_CODE || 'EPAYTEST',
  secretKey: import.meta.env.VITE_ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
};

const KHALTI_CONFIG = {
  endpoint: import.meta.env.VITE_KHALTI_ENDPOINT || 'https://dev.khalti.com/api/v2/epayment/initiate/',
  secretKey: import.meta.env.VITE_KHALTI_SECRET_KEY || import.meta.env.VITE_KHALTI_PUBLIC_KEY || '',
};

export const isKhaltiConfigured = () => Boolean(KHALTI_CONFIG.secretKey) || import.meta.env.DEV;

const generateEsewaSignature = (message, secret) => {
  const hash = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hash);
};

export const generateTransactionId = () => {
  return `PP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export const initiateEsewaPayment = ({
  totalAmount,
  amount,
  taxAmount = 0,
  serviceCharge = 0,
  deliveryCharge = 0,
  transactionUuid,
  successUrl,
  failureUrl,
}) => {
  const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_CONFIG.productCode}`;
  const signature = generateEsewaSignature(signatureMessage, ESEWA_CONFIG.secretKey);

  const formData = {
    amount: String(amount),
    tax_amount: String(taxAmount),
    total_amount: String(totalAmount),
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.productCode,
    product_service_charge: String(serviceCharge),
    product_delivery_charge: String(deliveryCharge),
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  };

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = ESEWA_CONFIG.endpoint;

  Object.keys(formData).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export const initiateKhaltiPayment = async ({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
  customerInfo,
}) => {
  const hasKey = Boolean(KHALTI_CONFIG.secretKey);

  if (!hasKey && import.meta.env.DEV) {
    const demoUrl = new URL(returnUrl);
    demoUrl.searchParams.set('status', 'completed');
    demoUrl.searchParams.set('pidx', `demo-${purchaseOrderId}`);
    demoUrl.searchParams.set('amount', String(Math.round(Number(amount))));
    return { payment_url: demoUrl.toString(), demo: true };
  }

  if (!hasKey) {
    throw new Error('Khalti sandbox key is missing. Add VITE_KHALTI_SECRET_KEY or choose eSewa/COD.');
  }

  const isDev = import.meta.env.DEV;
  const khaltiUrl = isDev
    ? '/api/khalti/api/v2/epayment/initiate/'
    : KHALTI_CONFIG.endpoint;

  const payload = {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount: String(Math.round(Number(amount))),
    purchase_order_id: String(purchaseOrderId),
    purchase_order_name: purchaseOrderName,
  };

  if (customerInfo?.name || customerInfo?.email || customerInfo?.phone) {
    payload.customer_info = {
      name: customerInfo.name || 'CHLORO Customer',
      email: customerInfo.email || '',
      phone: customerInfo.phone || '',
    };
  }

  const response = await fetch(khaltiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.detail
      || data?.message
      || Object.values(data || {})?.flat?.()?.join(' ')
      || 'Khalti initiation failed.';
    throw new Error(message);
  }

  if (!data?.payment_url) {
    throw new Error('Khalti did not return a payment URL.');
  }

  return data;
};

export const parseEsewaResponse = (base64Data) => {
  try {
    const decoded = atob(base64Data);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to parse eSewa response:', e);
    return null;
  }
};

export const getBaseUrl = () => {
  return window.location.origin;
};
