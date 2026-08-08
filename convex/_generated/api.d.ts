/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as aiHelpers from "../aiHelpers.js";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as chat from "../chat.js";
import type * as documents from "../documents.js";
import type * as documentsInternal from "../documentsInternal.js";
import type * as http from "../http.js";
import type * as knowledge from "../knowledge.js";
import type * as lib_ownership from "../lib/ownership.js";
import type * as lib_polarWebhook from "../lib/polarWebhook.js";
import type * as lib_subscriptionAccess from "../lib/subscriptionAccess.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  aiHelpers: typeof aiHelpers;
  auth: typeof auth;
  billing: typeof billing;
  chat: typeof chat;
  documents: typeof documents;
  documentsInternal: typeof documentsInternal;
  http: typeof http;
  knowledge: typeof knowledge;
  "lib/ownership": typeof lib_ownership;
  "lib/polarWebhook": typeof lib_polarWebhook;
  "lib/subscriptionAccess": typeof lib_subscriptionAccess;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
