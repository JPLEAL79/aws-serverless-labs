/**
 * Script MANUAL para invocar la Lambda "userProfileValidatorLambda"
 * NO es test automatizado
 */

import { config } from "dotenv";
import { LambdaInvoker } from "../shared/LambdaInvoker";

config();

async function main() {
  const functionName = "userProfileValidatorLambda";

  const payload = {
    userId: "USR-001",
    email: "test@test.com",
  };

  const invoker = new LambdaInvoker();
  const response = await invoker.invokeLambda(functionName, payload);

  console.log("Respuesta cruda:");
  console.log(response);

  // Decodificación correcta
  const rawPayload = Buffer.from(
    response.Payload as Uint8Array
  ).toString();

  const lambdaResult = JSON.parse(rawPayload);

  console.log("Payload decodificado:");
  console.log(lambdaResult);

  if (lambdaResult.statusCode !== 200) {
    console.error("Lambda respondió con error:", lambdaResult);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error invocando Lambda:", error);
  process.exitCode = 1;
});
