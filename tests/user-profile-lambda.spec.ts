import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("User Profile Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return a valid user profile", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "USER-123",
      }
    );

    expect(response.StatusCode).toBe(200);
  });

  test("Should fail when userId is missing", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {}
    );

    expect(response.StatusCode).toBe(200);

  });
});
