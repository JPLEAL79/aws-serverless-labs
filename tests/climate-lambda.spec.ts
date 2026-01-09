import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Climate Lambda - Automated Tests", () => {
  test("Should return valid climate data for a city", async () => {
    const lambdaInvoker = new LambdaInvoker();

    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // AWS SDK v3
    expect(response.StatusCode).toBe(200);

    const payload = JSON.parse(
      Buffer.from(response.Payload as Uint8Array).toString()
    );

    expect(payload.city).toBe("Temuco");
    expect(typeof payload.temperature).toBe("number");
    expect(typeof payload.wind).toBe("number");
  });
});
