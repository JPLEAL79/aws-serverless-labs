import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Climate Lambda - Automated Tests", () => {
  test("Should return valid climate data for a city", async () => {
    const lambdaInvoker = new LambdaInvoker();

    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // ✅ AWS SDK v3 usa StatusCode (no statusCode)
    expect(response.StatusCode).toBe(200);

    // ✅ El body viene en Payload como Uint8Array
    const payload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const body = JSON.parse(payload);

    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
