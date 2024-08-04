"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SubscribePlan({ priceId, price, description }) {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/stripe/checkout", {
        priceId: priceId,
      });
      const data = response.data;
      if (!data.ok) throw new Error("Something went wrong");

      router.push(data.result.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl">{description}</h1>
      <div className="flex gap-2 items-center justify-center">
        <p className="text-4xl font-bold tracking-tighter">{price}</p>
        <p className="text-sm text-black/40">
          per <br /> month
        </p>
      </div>
      <button
        className="bg-black text-white py-2 w-full rounded-full"
        onClick={handleSubmit}
      >
        Subscribe
      </button>
    </div>
  );
}
