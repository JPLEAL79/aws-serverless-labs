import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export class LambdaInvoker {
  async invokeLambda(functionName: string, payload: unknown) {

    // 🔑 Región explícita y determinística
    const region =
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      "us-east-1"; // fallback CI

    const client = new LambdaClient({ region });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    return client.send(command);
  }
}
