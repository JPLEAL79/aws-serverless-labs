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

    return client.send(command);
  }
}
