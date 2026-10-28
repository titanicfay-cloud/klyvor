import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Forces Next.js not to try and pre-render this route during build
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Moved client initialization INSIDE the function to prevent build errors
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await req.text();
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex");

    // Verify the request is genuinely from Paystack
    if (hash !== req.headers.get("x-paystack-signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { metadata, customer } = event.data;
      const { user_id, plan_id } = metadata;

      // Check for idempotency
      const { data: existingEvent } = await supabaseAdmin
        .from("webhook_events")
        .select("id")
        .eq("provider_event_id", event.data.id)
        .single();

      if (existingEvent) {
        return NextResponse.json({ received: true, message: "Already processed" });
      }

      // 1. Record the event
      await supabaseAdmin.from("webhook_events").insert([{
        provider_event_id: event.data.id,
        event_type: event.event
      }]);

      // 2. Update the user's subscription
      await supabaseAdmin.from("user_subscriptions").upsert({
        user_id: user_id,
        plan_id: plan_id,
        status: "active",
        provider_customer_id: customer.customer_code,
        provider_subscription_id: event.data.reference,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
