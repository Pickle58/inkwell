import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { subscriptionFieldsFromPolar } from "./billing";
import {
  validateEvent,
  WebhookVerificationError,
} from "./lib/polarWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.active",
  "subscription.canceled",
  "subscription.uncanceled",
  "subscription.revoked",
  "subscription.past_due",
]);

http.route({
  path: "/polar/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      console.error("POLAR_WEBHOOK_SECRET is not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    try {
      const event = validateEvent(body, headers, secret);

      if (SUBSCRIPTION_EVENTS.has(event.type)) {
        const data = event.data as {
          id: string;
          status: string;
          customerId: string;
          cancelAtPeriodEnd: boolean;
          currentPeriodEnd?: Date | string | number | null;
          trialEnd?: Date | string | number | null;
          customer?: { email?: string | null } | null;
        };

        const fields = subscriptionFieldsFromPolar(data);
        if (fields.email) {
          await ctx.runMutation(
            internal.billing.upsertSubscriptionFromPolar,
            fields,
          );
        } else {
          console.warn(
            `Polar webhook ${event.type} missing customer email for ${data.id}`,
          );
        }
      }

      return new Response("Accepted", { status: 202 });
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        console.error("Polar webhook verification failed", error);
        return new Response("Forbidden", { status: 403 });
      }
      console.error("Polar webhook error", error);
      throw error;
    }
  }),
});

export default http;
