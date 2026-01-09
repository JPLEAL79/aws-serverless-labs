import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * Encapsula la invocación de AWS Lambda usando AWS SDK v3.
 * - Maneja serialización del payload de entrada
 * - Decodifica el Payload de salida (Uint8Array → JSON)
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

    const response = await client.send(command);

    const decodedPayload = response.Payload
      ? JSON.parse(Buffer.from(response.Payload).toString())
      : null;

    return {
      ...response,
      payload: decodedPayload,
    };
  }
}
