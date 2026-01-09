import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Climate Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return valid climate data for a city", async () => {
    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // Invocación AWS OK
    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsed = JSON.parse(rawPayload);
    const body = JSON.parse(parsed.body);

    expect(parsed.statusCode).toBe(200);
    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
