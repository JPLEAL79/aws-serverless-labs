import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";


/**
 * Tests LOCALES para orderValidatorLambda.
 *
 * Estos tests invocan una Lambda REAL en AWS.
 * Por esa razón:
 * - Están marcados con @local
 * - NO deben ejecutarse en CI
 *
 * El objetivo es validar el contrato de la Lambda:
 * tipos de datos, reglas de negocio y mensajes de error.
 */

/**
 * CASOS POSITIVOS
 * Debe retornar 200 cuando el payload es completamente válido
 */
test("@local Should return 200 when order payload is valid", async () => {
  // Arrange: se crea el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Act: se invoca la Lambda con un payload válido
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    {
      orderId: "ORD-12345", // ID con formato realista
      amount: 150.5,        // Monto numérico válido (> 0)
      currency: "USD",      // Moneda válida
    }
  );

  // Assert: se valida el status code
  expect(response.statusCode).toBe(200);

  // Se parsea el body de la respuesta
  const body = JSON.parse(response.body ?? "{}");

  // Se valida el mensaje esperado
  expect(body.message).toBe("Order is valid");
});

/**
 * CASO NEGATIVO
 * Debe retornar 400 cuando orderId NO viene en el payload
 */
test("@local Should return 400 when orderId is missing", async () => {
  // Arrange: se crea el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Payload inválido: falta orderId
  const payload = {
    amount: 100,
    currency: "USD",
  };

  // Act: se invoca la Lambda
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    payload
  );

  // Assert: se valida el status code
  expect(response.statusCode).toBe(400);

  // Se parsea el body
  const body = JSON.parse(response.body ?? "{}");

  // Se valida el mensaje de error
  expect(body.error).toBe("orderId is required");
});

/**
 * 3- CASO NEGATIVO
 * Debe retornar 400 cuando amount es inválido (<= 0)
 */
test("@local Should return 400 when amount is invalid", async () => {
  // Arrange: se crea el invocador de Lambdas
  const lambdaInvoker = new LambdaInvoker();

  // Payload inválido: amount menor o igual a cero
  const payload = {
    orderId: "ORD-99999",
    amount: 0,
    currency: "USD",
  };

  // Act: se invoca la Lambda
  const response = await lambdaInvoker.invokeLambda(
    "orderValidatorLambda",
    payload
  );

  // Assert: se valida el status code
  expect(response.statusCode).toBe(400);

  // Se parsea el body
  const body = JSON.parse(response.body ?? "{}");

  // Se valida el mensaje de error esperado
  expect(body.error).toBe("amount must be greater than zero");
});




