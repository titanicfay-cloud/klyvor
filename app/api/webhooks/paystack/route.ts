import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// We use the Supabase Service Role Key here because the webhook is not authenticated as a user.
// It needs permission to update the user's subscription directly.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // You will need to add this to your .env
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex");

    // Verify the request is genuinely from Paystack
    if (hash !== req.headers.get("x-paystack-signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Check if the event is a successful charge
    if (event.event === "charge.success") {
      const { metadata, customer } = event.data;
      const { user_id, plan_id } = metadata;

      // Check for idempotency (prevent processing the same event twice)
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
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }, { onConflict: "user_id" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
