import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export class LambdaInvoker {

  async invokeLambda(functionName: string, payload: unknown) {
    const region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

    if (!region) {
      throw new Error(
        "Falta AWS_REGION (o AWS_DEFAULT_REGION) en variables de entorno."
      );
    }

    const client = new LambdaClient({ region });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    return client.send(command);
  }
}
