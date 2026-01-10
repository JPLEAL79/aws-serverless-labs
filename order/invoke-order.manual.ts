/**
 * Script MANUAL para invocar la Lambda "orderValidatorLambda"
 * NO es test automatizado
 */

import { config } from "dotenv";
import { LambdaInvoker } from "../shared/LambdaInvoker";

config();

async function main() {
  const functionName = "orderValidatorLambda";

  const payload = {
    orderId: "ORD-12345",
    amount: 150.5,
    currency: "USD",
  };

  const invoker = new LambdaInvoker();
  const response = await invoker.invokeLambda(functionName, payload);

  console.log("Respuesta cruda:");
  console.log(response);

  //  Decodificación correcta
  const rawPayload = Buffer.from(
    response.Payload as Uint8Array
  ).toString();

  const lambdaResult = JSON.parse(rawPayload);

  console.log("Payload decodificado:");
  console.log(lambdaResult);

  // Validación MANUAL clara
  if (lambdaResult.statusCode !== 200) {
    console.error("Lambda respondió con error:", lambdaResult);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error invocando Lambda:", error);
  process.exitCode = 1;
});
