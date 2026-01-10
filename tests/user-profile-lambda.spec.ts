import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";
import { parseLambdaPayload } from "../shared/lambdaPayloadParser";

/**
 * Tests automatizados para la Lambda userProfileValidatorLambda
 *
 * Objetivo:
 * - Validar reglas de negocio definidas en la Lambda
 * - Verificar respuestas funcionales reales
 *
 * IMPORTANTE:
 * - AWS SDK v3 devuelve StatusCode 200 si la invocación fue exitosa
 * - El status real viene dentro del payload de la Lambda
 */
test.describe("@aws User Profile Lambda - Automated Tests", () => {
  // Invocador reutilizable para AWS Lambda
  const lambdaInvoker = new LambdaInvoker();

  /**
   * Caso positivo:
   * - userId válido
   * - email válido
   */
  test("Should accept a valid user profile", async () => {
    // Invocación real a la Lambda en AWS
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "USER-123",
        email: "test@test.com",
      }
    );

    // Validación técnica: la invocación a AWS fue exitosa
    expect(response.StatusCode).toBe(200);

    // Parseo centralizado del payload Lambda (helper)
    const parsedPayload = parseLambdaPayload(
      response.Payload as Uint8Array
    );

    // Validación funcional del status interno de la Lambda
    expect(parsedPayload.statusCode).toBe(200);

    // El body YA viene parseado como objeto
    const body = parsedPayload.body;

    // Validación del mensaje esperado
    expect(body.message).toBe("User profile is valid");
  });

  /**
   * Caso negativo:
   * - Falta userId (regla obligatoria)
   */
  test("Should fail when userId is missing", async () => {
    // Invocación real a la Lambda en AWS
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        email: "test@test.com",
      }
    );

    // Validación técnica: la invocación a AWS fue exitosa
    expect(response.StatusCode).toBe(200);

    // Parseo centralizado del payload Lambda (helper)
    const parsedPayload = parseLambdaPayload(
      response.Payload as Uint8Array
    );

    // Validación funcional del status interno de la Lambda
    expect(parsedPayload.statusCode).toBe(400);

    // El body YA viene parseado como objeto
    const body = parsedPayload.body;

    // Validación del error esperado
    expect(body.error).toBe("userId is required");
  });
});
