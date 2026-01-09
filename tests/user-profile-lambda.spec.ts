import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "../shared/LambdaInvoker";


/**
 * Tests LOCALES para la Lambda userProfileValidatorLambda.
 * Validan flujos positivos y negativos.
 * Estos tests invocan Lambdas reales, por eso usan @local.
 */
test.describe("UserProfileValidatorLambda", () => {

  test("@local Should return 200 when payload is valid", async () => {
    // Arrange: se crea el invocador de Lambdas
    const lambdaInvoker = new LambdaInvoker();

    // Act: se invoca la Lambda con un payload válido
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "123",
        email: "jp@mail.com",
        age: 30,
      }
    );

    // Assert: se valida status code exitoso
    expect(response.statusCode).toBe(200);

    // Se parsea el body de la respuesta
    const body = JSON.parse(response.body ?? "{}");

    // Se valida el mensaje retornado
    expect(body.message).toBe("User profile is valid");
  });

  test("@local Should return 400 when userId is missing", async () => {
    // Arrange
    const lambdaInvoker = new LambdaInvoker();

    // Act: se invoca la Lambda con payload inválido
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        email: "jp@mail.com",
      }
    );

    // Assert: se valida error controlado
    expect(response.statusCode).toBe(400);

    // Se parsea el body de error
    const body = JSON.parse(response.body ?? "{}");

    // Se valida mensaje de error
    expect(body.error).toBe("userId is required");
  });

});
