import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (!encodedData) return;

    axios
      .post("/api/payment/verify", { encodedData })
      .then(({ data }) => {
        if (data.success) setStatus("✅ Payment successful!");
        else setStatus("❌ Payment verification failed.");
      })
      .catch(() => setStatus("❌ Error verifying payment."));
  }, []);

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-semibold">{status}</h2>
    </div>
  );
}