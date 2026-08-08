import { Buffer } from "buffer";

// Polar's validateEvent expects Node Buffer in the Convex isolate.
globalThis.Buffer = Buffer;

export {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
