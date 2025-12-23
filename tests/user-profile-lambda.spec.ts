import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "./utils/LambdaInvoker";

test.describe("UserProfileValidatorLambda", () => {

  test("Should return 200 when payload is valid", async () => {
    // Arrange: se crea el invocador de Lambdas
    const lambdaInvoker = new LambdaInvoker();

    // Act: se invoca la Lambda con payload válido
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        userId: "123",
        email: "jp@mail.com",
        age: 30,
      }
    );

    // Assert: validación del flujo positivo
    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body ?? "{}");
    expect(body.message).toBe("User profile is valid");
  });

  test("Should return 400 when userId is missing", async () => {
    // Arrange
    const lambdaInvoker = new LambdaInvoker();

    // Act: payload inválido (falta userId)
    const response = await lambdaInvoker.invokeLambda(
      "userProfileValidatorLambda",
      {
        email: "jp@mail.com",
      }
    );

    // Assert: validación del error controlado
    expect(response.statusCode).toBe(400);

    const body = JSON.parse(response.body ?? "{}");
    expect(body.error).toBe("userId is required");
  });

});
