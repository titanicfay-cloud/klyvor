"use server";

import { createClient } from "@/lib/supabase/server";

export async function initializePaystackCheckout(planId: string, priceUSD: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 1. Default fallback rate (in case the API fails)
  let exchangeRate = 1370;

  // 2. Fetch live exchange rate (Free API, no key needed, cached for 1 hour)
  try {
    const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } });
    const rateData = await rateRes.json();
    if (rateData && rateData.rates && rateData.rates.NGN) {
      exchangeRate = rateData.rates.NGN;
    }
  } catch (error) {
    console.warn("Failed to fetch live rate, using fallback:", exchangeRate);
  }

  // 3. Convert USD to NGN and then to Kobo (Paystack requires Kobo)
  const amountInKobo = Math.round(priceUSD * exchangeRate * 100);

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://klyvortech.vercel.app'}/dashboard/settings/billing`,
        metadata: {
          user_id: user.id,
          plan_id: planId,
          usd_price: priceUSD, // Optional: Save the original USD price for your records
          exchange_rate_used: exchangeRate // Optional: Save the rate used
        },
      }),
    });

    const data = await response.json();
    if (!data.status) return { error: data.message || "Failed to initialize payment." };

    return { success: true, url: data.data.authorization_url };
  } catch (error) {
    return { error: "An error occurred connecting to Paystack." };
  }
}
