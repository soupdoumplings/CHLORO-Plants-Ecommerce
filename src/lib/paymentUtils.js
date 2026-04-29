/**
 * Payment Gateway Utilities — eSewa & Khalti
 * 
 * eSewa: Hidden form POST redirect with HMAC signing
 * Khalti: API-based payment initiation and redirect
 */
import CryptoJS from 'crypto-js';

// ─── eSewa Configuration (Test Mode) ─────────────────────────
const ESEWA_CONFIG = {
  endpoint: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  productCode: 'EPAYTEST',
  secretKey: '8gBm/:&EnhH.1/q',
};

// ─── Khalti Configuration (Test Mode) ────────────────────────
const KHALTI_CONFIG = {
  endpoint: 'https://a.khalti.com/api/v2/epayment/initiate/',
  secretKey: 'live_secret_key_68791341fdd94846a146f0457ff7b455',
};
/**
 * Generate HMAC-SHA256 signature for eSewa
 */
const generateEsewaSignature = (message, secret) => {
  const hash = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hash);
};

/**
 * Generate a unique transaction UUID
 */
export const generateTransactionId = () => {
  return `PP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

/**
 * Initiate eSewa payment via hidden form POST
 */
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
    signature: signature,
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

/**
 * Initiate Khalti payment via API call
 */
export const initiateKhaltiPayment = async ({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
}) => {
  try {
    const response = await fetch(KHALTI_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: returnUrl,
        website_url: websiteUrl,
        amount: amount,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Khalti initiation failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Khalti payment error:', error);
    throw error;
  }
};

/**
 * Parse eSewa success callback data
 */
export const parseEsewaResponse = (base64Data) => {
  try {
    const decoded = atob(base64Data);
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Failed to parse eSewa response:', e);
    return null;
  }
};

/**
 * Get the base URL for constructing callback URLs
 */
export const getBaseUrl = () => {
  return window.location.origin;
};
