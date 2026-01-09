import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export type LambdaJsonResponse = {
  statusCode?: number;
  body?: string;
  errorMessage?: string;
};

export class LambdaInvoker {
  private readonly lambdaClient: LambdaClient;

  constructor() {
  const region =
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    "us-east-1"; // fallback CI / local

  this.lambdaClient = new LambdaClient({ region });
}


  async invokeLambda(
    functionName: string,
    payload: object
  ): Promise<LambdaJsonResponse> {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
      InvocationType: "RequestResponse",
    });

    const response = await this.lambdaClient.send(command);

    const raw = response.Payload
      ? Buffer.from(response.Payload as Uint8Array).toString()
      : "{}";

    return JSON.parse(raw) as LambdaJsonResponse;
  }
}
