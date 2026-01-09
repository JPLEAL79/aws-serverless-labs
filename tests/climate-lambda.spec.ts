import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";

/**
 * Tests automatizados para la Lambda Clima
 * 
 * Valida:
 * - Ejecución correcta
 * - StatusCode 200
 * - Estructura del body
 */

test.describe("Climate Lambda - Automated Tests", () => {
  test("Should return valid climate data for a city", async () => {
    const lambdaInvoker = new LambdaInvoker();

    const response = await lambdaInvoker.invokeLambda("Clima", {
      city: "Temuco",
    });

    // Validación base
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    // Parseo del body (viene como string)
    const body = JSON.parse(response.body as string);

    // Validaciones funcionales
    expect(body.city).toBe("Temuco");
    expect(typeof body.temperature).toBe("number");
    expect(typeof body.wind).toBe("number");
  });
});
