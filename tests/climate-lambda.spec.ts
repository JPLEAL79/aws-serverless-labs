import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

/**
 * Tests automatizados para la Lambda Climate
 *
 * Objetivo:
 * - Validar comportamiento funcional real
 * - Verificar datos de clima obtenidos desde una API externa (Open-Meteo)
 *
 * IMPORTANTE:
 * - AWS SDK v3 devuelve StatusCode 200 si la INVOCACIÓN fue exitosa
 * - El status real viene dentro del payload de la Lambda
 */
test.describe("Climate Lambda - Automated Tests", () => {
  const lambdaInvoker = new LambdaInvoker();

  test("Should return valid climate data for a city", async () => {
    // Arrange
    const payloadInput = {
      city: "Temuco",
    };

    // Act: nombre REAL de la Lambda en AWS
    const response = await lambdaInvoker.invokeLambda(
      "Clima",
      payloadInput
    );

    // Assert: invocación exitosa
    expect(response.StatusCode).toBe(200);
    expect(response.Payload).toBeDefined();

    // Decode payload AWS SDK v3
    const rawPayload = Buffer.from(
      response.Payload as Uint8Array
    ).toString();

    const parsedPayload = JSON.parse(rawPayload);

    expect(parsedPayload.statusCode).toBe(200);

    const body = JSON.parse(parsedPayload.body);

    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
