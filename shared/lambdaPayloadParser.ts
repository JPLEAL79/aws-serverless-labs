/**
 * Helper para decodificar el payload devuelto por AWS Lambda (SDK v3)
 *
 * AWS Lambda devuelve:
 * - StatusCode técnico (invocación)
 * - Payload como Uint8Array
 *
 * Este helper:
 * - Convierte Uint8Array a string
 * - Parsea el JSON externo
 * - Parsea el body interno si existe
 *
 * Objetivo:
 * - Evitar duplicación de código en los tests
 * - Centralizar la lógica AWS en un solo lugar
 */
export function parseLambdaPayload(payload: Uint8Array) {
  // Convierte el payload binario a string
  const rawPayload = Buffer.from(payload).toString();

  // Primer parse: respuesta Lambda
  const parsed = JSON.parse(rawPayload);

  // Segundo parse: body interno (si existe)
  const body =
    typeof parsed.body === "string"
      ? JSON.parse(parsed.body)
      : parsed.body;

  return {
    statusCode: parsed.statusCode,
    body,
  };
}
