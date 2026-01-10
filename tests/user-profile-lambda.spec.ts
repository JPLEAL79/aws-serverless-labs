import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("User Profile Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return a valid user profile", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "USER-123",
        email: "user@test.com",
        age: 25,
      }
    );

    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsed = JSON.parse(rawPayload);

    expect(parsed.statusCode).toBe(200);
  });

  test("Should fail when userId is missing", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {}
    );

    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsed = JSON.parse(rawPayload);
    const body = JSON.parse(parsed.body);

    expect(parsed.statusCode).toBe(400);
    expect(body.error).toBeDefined();
  });
});
