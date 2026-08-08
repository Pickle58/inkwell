"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

type PolarCheckoutResponse = {
  url?: string;
  detail?: unknown;
  error?: string;
};

type PolarServer = "sandbox" | "production";

function polarServer(): PolarServer {
  const server = (process.env.POLAR_SERVER ?? "sandbox").trim().toLowerCase();
  return server === "production" ? "production" : "sandbox";
}

function polarApiBase(server: PolarServer): string {
  return server === "production"
    ? "https://api.polar.sh/v1"
    : "https://sandbox-api.polar.sh/v1";
}

function assertCheckoutUrlMatchesServer(url: string, server: PolarServer) {
  const host = new URL(url).host;
  if (server === "sandbox" && host !== "sandbox.polar.sh") {
    throw new Error(
      `Expected a sandbox.polar.sh checkout URL, got ${host}. Check POLAR_SERVER=sandbox and that POLAR_ACCESS_TOKEN is a sandbox OAT.`,
    );
  }
  if (server === "production" && host !== "polar.sh" && host !== "buy.polar.sh") {
    throw new Error(
      `Unexpected production checkout host ${host}. Check Polar configuration.`,
    );
  }
}

export const createCheckout = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const viewer = await ctx.runQuery(api.users.viewer, {});
    const email = viewer?.email?.trim().toLowerCase() ?? "";
    if (!email) {
      throw new Error("Account email is required for checkout");
    }

    const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
    const productId = process.env.POLAR_PRODUCT_ID?.trim();
    if (!accessToken || !productId) {
      throw new Error(
        "Polar is not configured. Set POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID on the Convex deployment.",
      );
    }

    const server = polarServer();
    const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(
      /\/$/,
      "",
    );

    const response = await fetch(`${polarApiBase(server)}/checkouts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: [productId],
        customer_email: email,
        embed_origin: siteUrl,
        success_url: `${siteUrl}/dashboard?checkout=success`,
      }),
    });

    const payload = (await response.json()) as PolarCheckoutResponse;
    if (!response.ok || !payload.url) {
      console.error("Polar checkout create failed", {
        status: response.status,
        server,
        payload,
      });
      throw new Error(
        `Could not create Polar ${server} checkout session (${response.status}).`,
      );
    }

    assertCheckoutUrlMatchesServer(payload.url, server);
    return { url: payload.url };
  },
});
