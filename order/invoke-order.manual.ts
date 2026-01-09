/**
 * Script MANUAL para invocar la Lambda "orderValidatorLambda".
 *
 * Uso:
 * - Validar credenciales AWS IAM
 * - Probar conectividad con AWS Lambda
 *
 * IMPORTANTE:
 * - NO es un test automatizado
 * - NO se ejecuta con Playwright
 */

import { config } from "dotenv";
import { LambdaInvoker } from "../shared/LambdaInvoker";

config();

async function main() {
  // Nombre EXACTO de la Lambda en AWS (según tu spec: orderValidatorLambda)
  const functionName = "orderValidatorLambda";

  // Payload válido (caso positivo)
  const payload = {
    orderId: "ORD-12345",
    amount: 150.5,
    currency: "USD",
  };

  // Invocador reutilizable (maneja región y parseo base de respuesta)
  const invoker = new LambdaInvoker();

  // Ejecuta invocación síncrona
  const response = await invoker.invokeLambda(functionName, payload);

  // Log simple para ver qué devolvió la Lambda
  console.log("Respuesta recibida desde la Lambda:");
  console.log(response);

  // Si la Lambda devolvió error, lo mostramos claro
  if (response.errorMessage) {
    console.error("Lambda devolvió error:", response.errorMessage);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Error invocando Lambda:", error);
  process.exitCode = 1;
});
