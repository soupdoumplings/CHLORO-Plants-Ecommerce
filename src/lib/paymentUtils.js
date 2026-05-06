/**
 * Payment Gateway Utilities — eSewa & Khalti
 *
 * These utilities handle payment initiation for both gateways
 * using their respective TEST/SANDBOX endpoints.
 *
 * eSewa: Hidden form POST redirect
 * Khalti: API-based redirect
 */
import CryptoJS from 'crypto-js';

// ─── eSewa Configuration (from .env) ─────────────────────────
const ESEWA_CONFIG = {
  endpoint: import.meta.env.VITE_ESEWA_ENDPOINT || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  productCode: import.meta.env.VITE_ESEWA_PRODUCT_CODE || 'EPAYTEST',
  secretKey: import.meta.env.VITE_ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
};

// ─── Khalti Configuration (from .env) ────────────────────────
const KHALTI_CONFIG = {
  endpoint: import.meta.env.VITE_KHALTI_ENDPOINT || 'https://a.khalti.com/api/v2/epayment/initiate/',
  secretKey: import.meta.env.VITE_KHALTI_SECRET_KEY || 'live_secret_key_68791341fdd94846a146f0457ff7b455',
};

/**
 * Generate HMAC-SHA256 signature for eSewa
 * @param {string} message - The message to sign (comma-separated values)
 * @param {string} secret - The secret key
 * @returns {string} Base64 encoded signature
 */
const generateEsewaSignature = (message, secret) => {
  const hash = CryptoJS.HmacSHA256(message, secret);
  return CryptoJS.enc.Base64.stringify(hash);
};

/**
 * Generate a unique transaction UUID
 * @returns {string} UUID string
 */
export const generateTransactionId = () => {
  return `PP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

/**
 * Initiate eSewa payment via hidden form POST
 *
 * @param {Object} params
 * @param {number} params.totalAmount - Total amount including tax/delivery
 * @param {number} params.amount - Product amount
 * @param {number} params.taxAmount - Tax amount (default 0)
 * @param {number} params.serviceCharge - Service charge (default 0)
 * @param {number} params.deliveryCharge - Delivery/shipping charge
 * @param {string} params.transactionUuid - Unique transaction ID
 * @param {string} params.successUrl - Redirect URL on success
 * @param {string} params.failureUrl - Redirect URL on failure
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
  // Build the signature message
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

  // Create and submit a hidden form
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
 * Initiate Khalti payment
 *
 * Note: In production, this API call MUST happen on the backend.
 * For sandbox/demo purposes, we call it from the frontend.
 *
 * @param {Object} params
 * @param {number} params.amount - Amount in PAISA (NPR 100 = 10000 paisa)
 * @param {string} params.purchaseOrderId - Unique order ID
 * @param {string} params.purchaseOrderName - Order description
 * @param {string} params.returnUrl - URL to redirect after payment
 * @param {string} params.websiteUrl - Your website URL
 * @returns {Promise<{payment_url: string, pidx: string}>}
 */
export const initiateKhaltiPayment = async ({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
}) => {
  try {
    // In dev, use Vite proxy to bypass CORS. In production, use the direct endpoint or your backend.
    const isDev = import.meta.env.DEV;
    const khaltiUrl = isDev
      ? '/api/khalti/api/v2/epayment/initiate/'
      : KHALTI_CONFIG.endpoint;

    const response = await fetch(khaltiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${KHALTI_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: returnUrl,
        website_url: websiteUrl,
        amount: amount, // in paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Khalti initiation failed');
    }

    const data = await response.json();
    return data; // { pidx, payment_url, ... }
  } catch (error) {
    console.error('Khalti payment error:', error);
    throw error;
  }
};

/**
 * Parse eSewa success callback data
 * eSewa returns base64 encoded JSON in the `data` query param
 *
 * @param {string} base64Data - The base64 encoded data from URL
 * @returns {Object} Parsed transaction data
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
 * @returns {string} Base URL (e.g., http://localhost:5173)
 */
export const getBaseUrl = () => {
  return window.location.origin;
};
