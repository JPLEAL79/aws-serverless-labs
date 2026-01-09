import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

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

    // Decodificar Payload (Uint8Array → string → JSON)
    const rawPayload = response.Payload
      ? Buffer.from(response.Payload as Uint8Array).toString()
      : undefined;

    const parsedPayload = rawPayload ? JSON.parse(rawPayload) : undefined;

    return {
      StatusCode: response.StatusCode,
      payload: parsedPayload?.body
        ? JSON.parse(parsedPayload.body)
        : parsedPayload,
    };
  }
}
