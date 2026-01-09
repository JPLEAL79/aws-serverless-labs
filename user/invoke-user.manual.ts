/**
 * Script MANUAL para invocar la Lambda userProfileValidatorLambda
 *
 * Uso:
 * - Validar credenciales AWS
 * - Probar conectividad con la Lambda de USER
 *
 * NO es test automatizado.
 */

import { config } from "dotenv";
import { LambdaInvoker } from "../shared/LambdaInvoker";

config();

async function main() {
  // Nombre EXACTO de la Lambda en AWS
  const functionName = "userProfileValidatorLambda";

  // Payload de prueba válido
  const payload = {
    userId: "USR-001",
    email: "test@test.com"
  };

  const invoker = new LambdaInvoker();

  const response = await invoker.invokeLambda(functionName, payload);

  console.log("Respuesta recibida desde la Lambda:");
  console.log(response);

  if (response.errorMessage) {
    console.error("Lambda devolvió error:", response.errorMessage);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error invocando Lambda:", error);
  process.exitCode = 1;
});
