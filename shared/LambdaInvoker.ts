import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * LambdaInvoker
 *
 * Responsabilidad ÚNICA:
 * - Invocar funciones AWS Lambda reales usando AWS SDK v3
 */
export class LambdaInvoker {
  /**
   * Cliente AWS Lambda reutilizable.
   * Se inicializa una sola vez por instancia.
   */
  private readonly client: LambdaClient;

  constructor() {
    /**
     * La región se obtiene desde variables de entorno.
     * En local: .env
     * En CI: GitHub Secrets
     */
    this.client = new LambdaClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  /**
   * Invoca una Lambda de forma síncrona.
   *
   * @param functionName Nombre EXACTO de la Lambda en AWS
   * @param payload Objeto de entrada (event)
   * @returns Respuesta cruda del AWS SDK v3
   */
  async invokeLambda(functionName: string, payload: unknown) {
    /**
     * El payload debe enviarse como JSON serializado
     * y convertido a Buffer.
     */
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    /**
     * Se ejecuta la invocación real contra AWS.
     */
    const response = await this.client.send(command);

    return response;
  }
}
