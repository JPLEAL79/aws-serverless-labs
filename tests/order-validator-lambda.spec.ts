import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Order Validator Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should accept a valid order", async () => {
    const response = await lambdaInvoker.invokeLambda("OrderValidator", {
      orderId: "ORD-123",
      amount: 150,
      currency: "USD",
    });

    expect(response.StatusCode).toBe(200);

    const payload = Buffer.from(response.Payload as Uint8Array).toString();
    const body = JSON.parse(payload);

    expect(body.valid).toBe(true);
  });

  test("Should reject an invalid order", async () => {
    const response = await lambdaInvoker.invokeLambda("OrderValidator", {
      orderId: "",
      amount: -10,
      currency: "USD",
    });

    expect(response.StatusCode).toBe(400);

    const payload = Buffer.from(response.Payload as Uint8Array).toString();
    const body = JSON.parse(payload);

    expect(body.valid).toBe(false);
  });
});



