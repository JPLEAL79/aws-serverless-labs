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

    // AWS Lambda Invoke OK
    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsed = JSON.parse(rawPayload);

    expect(parsed.statusCode).toBe(200);
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

    // Lambda Invoke SIEMPRE responde 200
    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsed = JSON.parse(rawPayload);
    const body = JSON.parse(parsed.body);

    // Validación REAL de negocio
    expect(parsed.statusCode).toBe(400);
    expect(body.error).toBeDefined();
  });
});
