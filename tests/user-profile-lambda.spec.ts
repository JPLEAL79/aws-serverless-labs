import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("User Profile Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return a valid user profile", async () => {
    const response = await lambdaInvoker.invokeLambda("UserProfile", {
      userId: "USER-123",
    });

    expect(response.StatusCode).toBe(200);

    const payload = Buffer.from(response.Payload as Uint8Array).toString();
    const body = JSON.parse(payload);

    expect(body.userId).toBe("USER-123");
    expect(body.name).toBeDefined();
  });

  test("Should fail when userId is missing", async () => {
    const response = await lambdaInvoker.invokeLambda("UserProfile", {});

    expect(response.StatusCode).toBe(400);

    const payload = Buffer.from(response.Payload as Uint8Array).toString();
    const body = JSON.parse(payload);

    expect(body.error).toBeDefined();
  });
});
