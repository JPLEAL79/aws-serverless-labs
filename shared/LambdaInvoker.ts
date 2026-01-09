import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * LambdaInvoker
 *
 * Wrapper simple para invocar AWS Lambda usando AWS SDK v3.
 * NO interpreta lógica de negocio.
 * SOLO ejecuta la Lambda y devuelve la respuesta cruda de AWS.
 */
export class LambdaInvoker {
  async invokeLambda(functionName: string, payload: unknown) {
    const client = new LambdaClient({
      region: "us-east-1",
    });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    return client.send(command);
  }
}
