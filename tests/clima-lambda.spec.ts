import { test, expect } from "@playwright/test";
import { LambdaInvoker } from "./utils/LambdaInvoker";

test("Should return weather data for a valid city", async () => {
  // Arrange
  const lambdaInvoker = new LambdaInvoker();

  // Act
  const lambdaResponse = await lambdaInvoker.invokeLambda("Clima", {
    city: "Santiago",
  });

  // Assert (básico)
  expect(lambdaResponse).toBeDefined();
  expect(lambdaResponse.errorMessage).toBeUndefined();

  // Si tu Lambda responde tipo { statusCode, body: "jsonString" }
  const responseBody = JSON.parse(lambdaResponse.body ?? "{}");
  expect(responseBody.temperature).toBeGreaterThan(-50);
  console.log("Temperature returned by Lambda:", responseBody.temperature);
});
