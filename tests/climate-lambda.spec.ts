import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";
import { parseLambdaPayload } from "../shared/lambdaPayloadParser";

/**
 * Tests automatizados para la Lambda Climate
 *
 * Objetivo:
 * - Validar comportamiento funcional real de la Lambda
 * - Validar datos de clima obtenidos desde una API externa (Open-Meteo)
 *
 * IMPORTANTE:
 * - AWS SDK v3 devuelve StatusCode 200 si la invocación a Lambda fue exitosa
 * - El status real del negocio viene dentro del payload retornado por la Lambda
 */
test.describe("@aws Climate Lambda - Automated Tests", () => {
  // Invocador reutilizable para AWS Lambda
  const lambdaInvoker = new LambdaInvoker();

  test("Should return valid climate data for a city", async () => {
    // Invocación real a la Lambda en AWS
    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // Validación técnica: AWS invocó correctamente la Lambda
    expect(response.StatusCode).toBe(200);

    // Parseo centralizado del payload Lambda
    const parsedPayload = parseLambdaPayload(
      response.Payload as Uint8Array
    );

    // Validación funcional del status interno
    expect(parsedPayload.statusCode).toBe(200);

    // El body YA viene como objeto (NO string)
    const body = parsedPayload.body;

    // Validaciones funcionales del contenido
    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
