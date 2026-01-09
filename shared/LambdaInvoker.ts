import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * Respuesta base esperada desde una Lambda
 */
export type LambdaJsonResponse = {
  statusCode?: number;
  body?: string;
  errorMessage?: string;
};

export class LambdaInvoker {
  private readonly lambdaClient: LambdaClient;

  constructor() {
  
    const region = "us-east-1";

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

    if (response.FunctionError) {
      return {
        errorMessage: `Lambda FunctionError: ${response.FunctionError}`,
        body: response.Payload
          ? Buffer.from(response.Payload as Uint8Array).toString()
          : "",
      };
    }

    const raw = response.Payload
      ? Buffer.from(response.Payload as Uint8Array).toString()
      : "{}";

    return JSON.parse(raw) as LambdaJsonResponse;
  }
}
