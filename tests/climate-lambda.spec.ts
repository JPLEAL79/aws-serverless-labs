import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Climate Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return valid climate data for a city", async () => {
    // Act: invoke Lambda
    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // Assert: Lambda invocation OK
    expect(response.StatusCode).toBe(200);

    // Decode AWS SDK v3 payload (Uint8Array -> string -> JSON)
    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    // Handle Lambdas that return body as string
    const body =
      typeof parsedPayload.body === "string"
        ? JSON.parse(parsedPayload.body)
        : parsedPayload;

    // Assert business data
    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
