"use server";

import { createClient } from "@/lib/supabase/server";

export async function initializePaystackCheckout(planId: string, priceUSD: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Convert USD to NGN for Paystack testing (Approximate rates)
  const ngnRates: Record<number, number> = {
    19: 3000000, // 30,000 NGN in kobo
    39: 6000000, // 60,000 NGN in kobo
    69: 10000000, // 100,000 NGN in kobo
    99: 15000000, // 150,000 NGN in kobo
  };

  const amountInKobo = ngnRates[priceUSD] || 3000000; // Default 30k NGN

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
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: planId }
          ]
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
