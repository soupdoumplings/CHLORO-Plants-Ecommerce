import { useState } from "react";
import axios from "axios";

const ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
// For production: "https://epay.esewa.com.np/api/epay/main/v2/form"

export default function EsewaButton({ amount, orderId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/payment/initiate", {
        amount,
        orderId,
      });

      if (data.success) {
        setFormData(data.data);
        // Submit the hidden form after state updates
        setTimeout(() => {
          document.getElementById("esewa-form").submit();
        }, 100);
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Processing..." : "Pay with eSewa"}
      </button>

      {/* Hidden form that auto-submits to eSewa */}
      {formData && (
        <form
          id="esewa-form"
          action={ESEWA_URL}
          method="POST"
          style={{ display: "none" }}
        >
          <input type="hidden" name="amount" value={formData.amount} />
          <input type="hidden" name="tax_amount" value={formData.tax_amount} />
          <input type="hidden" name="total_amount" value={formData.total_amount} />
          <input type="hidden" name="transaction_uuid" value={formData.transaction_uuid} />
          <input type="hidden" name="product_code" value={formData.product_code} />
          <input type="hidden" name="product_service_charge" value={formData.product_service_charge} />
          <input type="hidden" name="product_delivery_charge" value={formData.product_delivery_charge} />
          <input type="hidden" name="success_url" value={formData.success_url} />
          <input type="hidden" name="failure_url" value={formData.failure_url} />
          <input type="hidden" name="signed_field_names" value={formData.signed_field_names} />
          <input type="hidden" name="signature" value={formData.signature} />
        </form>
      )}
    </div>
  );
}