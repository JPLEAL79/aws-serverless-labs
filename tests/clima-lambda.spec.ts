import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "./utils/LambdaInvoker";

/**
 * Test LOCAL para validar la Lambda de clima.
 * Este test invoca una Lambda REAL en AWS.
 * Por seguridad, se ejecuta solo en local (@local).
 */
test("@local Should return weather data for a valid city", async () => {
  // Se crea el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Se invoca la Lambda con un payload válido
  const response = await lambdaInvoker.invokeLambda("Clima", {
    city: "Santiago",
  });

  // Se valida que exista respuesta
  expect(response).toBeDefined();

  // No debe venir errorMessage en flujo positivo
  expect(response.errorMessage).toBeUndefined();

  // Se parsea el body retornado por la Lambda
  const body = JSON.parse(response.body ?? "{}");

  // Validación básica del valor retornado
  expect(body.temperature).toBeGreaterThan(-50);

  // Log útil solo para debugging local
  console.log("Temperature returned by Lambda:", body.temperature);
});
