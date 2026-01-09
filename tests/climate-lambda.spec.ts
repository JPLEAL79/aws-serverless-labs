import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Climate Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return valid climate data for a city", async () => {
    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    expect(response.StatusCode).toBe(200);

    const payload = response.payload;

    expect(payload.city).toBe("Temuco");
    expect(typeof payload.temperature).toBe("number");
    expect(typeof payload.wind).toBe("number");
  });
});
