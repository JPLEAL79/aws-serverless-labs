import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

/**
 * Test automatizado para la Lambda userProfileValidatorLambda
 *
 * Objetivo:
 * - Validar comportamiento funcional real
 * - Validar reglas de negocio definidas en la Lambda
 *
 * IMPORTANTE:
 * - El SDK de AWS devuelve StatusCode 200 siempre
 * - El status real viene dentro del payload
 */
test.describe("@aws User Profile Lambda - Automated Tests", () => {
  // Invocador reutilizable de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  /**
   * Caso positivo:
   * - userId válido
   * - email válido
   */
  test("Should accept a valid user profile", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "USER-123",
        email: "test@test.com",
      }
    );

    // Validación técnica
    expect(response.StatusCode).toBe(200);

    // Decodificación del payload
    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    // Validación funcional
    expect(parsedPayload.statusCode).toBe(200);

    const body = JSON.parse(parsedPayload.body);

    expect(body.message).toBe("User profile is valid");
  });

  /**
   * Caso negativo:
   * - Falta userId
   */
  test("Should fail when userId is missing", async () => {
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        email: "test@test.com",
      }
    );

    expect(response.StatusCode).toBe(200);

    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    expect(parsedPayload.statusCode).toBe(400);

    const body = JSON.parse(parsedPayload.body);

    expect(body.error).toBe("userId is required");
  });
});
