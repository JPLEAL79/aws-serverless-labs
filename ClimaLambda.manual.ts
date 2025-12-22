/**
 * Script de uso MANUAL.
 * 
 * Utilizado para:
 * - Validar credenciales AWS IAM
 * - Probar conectividad con Lambda
 *
 * No forma parte de los tests automatizados con Playwright.
 */

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";


config();

const lambda = new LambdaClient({ region: process.env.AWS_REGION });

async function invokeLambda() {
  const functionName = "Clima";
  const payload = JSON.stringify({ city: "Temuco" });


  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(payload),
    InvocationType: "RequestResponse",
  });

  try {
    const response = await lambda.send(command);

    const responsePayload = JSON.parse(
      Buffer.from(response.Payload as Uint8Array).toString()
    );

    console.log("Lambda response received:", responsePayload);

    if (responsePayload.errorMessage) {
      console.error("Lambda returned an error:", responsePayload.errorMessage);
    } else {
      console.log("Lambda invocation completed successfully");
    }
  } catch (error) {
    console.error("Error invoking Lambda:", error);
  }
}

invokeLambda();
