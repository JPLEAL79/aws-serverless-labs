/**
 * LambdaInvoker
 *
 * Utilidad central para invocar AWS Lambda usando AWS SDK v3.
 *
 * Se usa en:
 * - Scripts MANUALES (CLI)
 * - Tests AUTOMATIZADOS (Playwright)
 * - CI (GitHub Actions)
 *
 * Este archivo es la "fuente de verdad" para invocaciones Lambda.
 */

import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandOutput,
} from "@aws-sdk/client-lambda";

export class LambdaInvoker {
  private client: LambdaClient;

  constructor() {
    /**
     * El cliente Lambda se inicializa usando variables de entorno:
     * - AWS_REGION
     * - AWS_ACCESS_KEY_ID
     * - AWS_SECRET_ACCESS_KEY
     *
     * Esto funciona igual en local (.env) y en CI (GitHub Secrets)
     */
    this.client = new LambdaClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  /**
   * Invoca una Lambda de forma síncrona.
   *
   * @param functionName Nombre EXACTO de la Lambda en AWS
   * @param payload Objeto JSON que se envía como evento
   *
   * @returns Respuesta cruda de AWS (InvokeCommandOutput)
   */
  async invokeLambda(
    functionName: string,
    payload: Record<string, any>
  ): Promise<InvokeCommandOutput> {
    /**
     * El payload debe enviarse como string JSON convertido a Uint8Array
     * porque AWS SDK v3 no acepta objetos directamente.
     */
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: "RequestResponse", // síncrono
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    /**
     * Se envía la invocación a AWS.
     * Si falla aquí, el problema es:
     * - credenciales
     * - permisos
     * - nombre de la Lambda
     */
    const response = await this.client.send(command);

    return response;
  }

  /**
   * Helper opcional para decodificar el payload de respuesta.
   *
   * NO se usa automáticamente para mantener control explícito
   * en tests y scripts manuales.
   */
  static decodePayload(payload?: Uint8Array): any {
    if (!payload) {
      return null;
    }

    const decoded = Buffer.from(payload).toString();
    return JSON.parse(decoded);
  }
}
