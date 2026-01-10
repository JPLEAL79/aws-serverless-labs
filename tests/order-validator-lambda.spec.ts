import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";
import { parseLambdaPayload } from "../shared/lambdaPayloadParser";

/**
 * Tests automatizados para la Lambda Order Validator
 *
 * Objetivo:
 * - Validar reglas de negocio reales
 * - Aceptar órdenes válidas
 * - Rechazar órdenes inválidas
 *
 * IMPORTANTE:
 * - AWS SDK v3 devuelve StatusCode 200 si la invocación fue exitosa
 * - El status real del negocio viene dentro del payload
 */
test.describe("Order Validator Lambda - Automated Tests", () => {
  // Invocador reutilizable de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  /**
   * Caso positivo:
   * - orderId válido
   * - amount > 0
   * - currency válida
   */
  test("Should accept a valid order", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "orderValidatorLambda",
      {
        orderId: "ORD-12345",
        amount: 150.5,
        currency: "USD",
      }
    );

    // Validación técnica de invocación
    expect(response.StatusCode).toBe(200);

    // Parseo centralizado del payload
    const parsed = parseLambdaPayload(response.Payload as Uint8Array);

    // Validación funcional
    expect(parsed.statusCode).toBe(200);
    expect(parsed.body.message).toBe("Order is valid");
  });

  /**
   * Caso negativo:
   * - orderId vacío
   * - amount inválido
   */
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

    const parsed = parseLambdaPayload(response.Payload as Uint8Array);

    expect(parsed.statusCode).toBe(400);
    expect(parsed.body.error).toBe("orderId is required");

  });
});
