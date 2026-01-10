/**
 * Tests automatizados para la Lambda Order Validator
 *
 * Objetivo:
 * - Validar reglas de negocio de órdenes
 * - Asegurar contrato estándar de respuesta Lambda
 *
 * IMPORTANTE:
 * - AWS SDK v3 devuelve StatusCode 200 si la invocación fue exitosa
 * - El status real de la lógica viene dentro del payload.statusCode
 */

import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

test.describe("Order Validator Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();
  const functionName = "orderValidatorLambda";

  test("Should accept a valid order", async () => {
    // Payload válido
    const payload = {
      orderId: "ORD-123",
      amount: 150,
      currency: "USD",
    };

    // Invocación real de la Lambda
    const response = await lambdaInvoker.invokeLambda(functionName, payload);

    // 1️⃣ La invocación AWS fue exitosa
    expect(response.StatusCode).toBe(200);

    // 2️⃣ Decodificación del payload (Uint8Array → JSON)
    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    // 3️⃣ Validación de lógica de negocio
    expect(parsedPayload.statusCode).toBe(200);

    const body = JSON.parse(parsedPayload.body);
    expect(body.message).toBe("Order is valid");
    expect(body.order.orderId).toBe("ORD-123");
  });

  test("Should reject an invalid order", async () => {
    // Payload inválido
    const payload = {
      orderId: "",
      amount: -10,
      currency: "USD",
    };

    const response = await lambdaInvoker.invokeLambda(functionName, payload);

    // Invocación correcta a AWS
    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    // Error de negocio
    expect(parsedPayload.statusCode).toBe(400);

    const body = JSON.parse(parsedPayload.body);
    expect(body.error).toBeDefined();
  });
});
