import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "./utils/LambdaInvoker";

/**
 * Tests LOCALES para orderValidatorLambda.
 * Estos tests invocan una Lambda REAL en AWS,
 * por eso están marcados con @local.
 */

/**
 * CASO POSITIVO
 * Debe retornar 200 cuando el payload es válido
 */
test("@local Should return 200 when order payload is valid", async () => {
  // Arrange: creamos el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Invoca la Lambda con un payload válido
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    {
      orderId: "ORD-123",
      amount: 150,
      currency: "USD",
    }
  );

  // Assert: valida el status code
  expect(response.statusCode).toBe(200);

  // Parsea el body de la respuesta
  const body = JSON.parse(response.body ?? "{}");

  // Valida el mensaje esperado
  expect(body.message).toBe("Order is valid");
});

/**
 * CASOS NEGATIVOS
 * Debe retornar 400 cuando orderId NO viene en el payload
 */
test("@local Should return 400 when orderId is missing", async () => {
  // Arrange: creamos el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Payload inválido (sin orderId)
  const payload = {
    amount: 100,
    currency: "USD",
  };

  // Invoca la Lambda
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    payload
  );

  // Assert: valida el status code
  expect(response.statusCode).toBe(400);

  // Parsea el body
  const body = JSON.parse(response.body ?? "{}");

  // Valida el mensaje de error
  expect(body.error).toBe("orderId is required");
});

/**
 * Debe retornar 400 cuando amount es inválido (<= 0)
 */
test("@local Should return 400 when amount is invalid", async () => {
  // Arrange: creamos el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Payload inválido: amount <= 0
  const payload = {
    orderId: "ORD-999",
    amount: 0,
    currency: "USD",
  };

  // Invocamos la Lambda
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    payload
  );

  // Assert: valida el status code
  expect(response.statusCode).toBe(400);

  // Parsea el body
  const body = JSON.parse(response.body ?? "{}");

  // Valida el mensaje de error esperado
  expect(body.error).toBe("amount must be greater than zero");
});




