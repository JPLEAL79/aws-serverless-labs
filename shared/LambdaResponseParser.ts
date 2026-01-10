/**
 * Utilidad para decodificar y normalizar respuestas
 * devueltas por AWS Lambda (SDK v3)
 *
 * Centraliza:
 * - Buffer -> string
 * - JSON.parse
 * - body interno
 *
 * Esto evita duplicación en los tests automatizados.
 */

export class LambdaResponseParser {
  /**
   * Decodifica el payload crudo de AWS Lambda
   *
   * @param payload Uint8Array devuelto por AWS SDK v3
   * @returns Objeto con statusCode y body parseado
   */
  static parse(payload: Uint8Array): {
    statusCode: number;
    body: any;
  } {
    // AWS devuelve el payload como Uint8Array
    const rawPayload = Buffer.from(payload).toString();

    // Primer parse: estructura Lambda { statusCode, body }
    const parsedPayload = JSON.parse(rawPayload);

    // El body viene como string JSON
    const parsedBody =
      typeof parsedPayload.body === "string"
        ? JSON.parse(parsedPayload.body)
        : parsedPayload.body;

    return {
      statusCode: parsedPayload.statusCode,
      body: parsedBody,
    };
  }
}
