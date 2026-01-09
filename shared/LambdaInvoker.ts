import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export class LambdaInvoker {
  private client?: LambdaClient;

  private getClient(): LambdaClient {
    if (this.client) {
      return this.client;
    }

    const region =
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

    if (!region) {
      throw new Error(
        "Falta AWS_REGION (o AWS_DEFAULT_REGION) en variables de entorno."
      );
    }

    this.client = new LambdaClient({ region });
    return this.client;
  }

  async invokeLambda(functionName: string, payload: unknown) {
    const client = this.getClient();

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    return client.send(command);
  }
}
