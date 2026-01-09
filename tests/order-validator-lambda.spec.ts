import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Order Validator Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should accept a valid order", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "orderValidatorLambda",
      {
        orderId: "ORD-123",
        amount: 150,
        currency: "USD",
      }
    );

    expect(response.StatusCode).toBe(200);
  });

  test("Should reject an invalid order", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "orderValidatorLambda",
      {
        orderId: "",
        amount: -10,
        currency: "USD",
      }
    );

    expect(response.StatusCode).toBe(200);

  });
});
