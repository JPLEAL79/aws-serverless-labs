/**
 * Script MANUAL para invocar la Lambda "Clima".
 *
 * Uso:
 * - Validar credenciales AWS IAM
 * - Probar conectividad con AWS Lambda
 *
 * IMPORTANTE:
 * - NO es un test automatizado
 * - NO se ejecuta con Playwright
 * - NO genera evidencia QA
 */

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";
import { TEST_CITY } from "./testData";


// Carga variables de entorno desde .env
config();

// Cliente AWS Lambda usando la región configurada
const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
});

async function invokeLambda() {
  // Nombre EXACTO de la Lambda en AWS
  const functionName = "Clima";

  // Payload de prueba (dato centralizado)
  const payload = {
    city: TEST_CITY,
  };

  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(JSON.stringify(payload)),
    InvocationType: "RequestResponse",
  });

  try {
    const response = await lambdaClient.send(command);

    const responsePayload = JSON.parse(
      Buffer.from(response.Payload as Uint8Array).toString()
    );

    console.log("Respuesta recibida desde la Lambda:");
    console.log(responsePayload);

  } catch (error) {
    console.error("Error invocando la Lambda:", error);
  }
}

// Ejecuta el script manual
invokeLambda();
