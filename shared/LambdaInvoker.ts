import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { config } from "dotenv";

if (!process.env.GITHUB_ACTIONS) {
  config();
}

/**
 * Estructura base que se espera recibir desde la Lambda.
 */
export type LambdaJsonResponse = {
  statusCode?: number;
  body?: string;
  errorMessage?: string;
};

export class LambdaInvoker {
  // Cliente reutilizable para invocar Lambdas (evita recrearlo en cada llamada)
  private readonly lambdaClient: LambdaClient;

  constructor() {
    //Región desde env (AWS_REGION o AWS_DEFAULT_REGION)
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

    // Si no hay región, el SDK no podrá resolver el endpoint
    if (!region) {
      throw new Error(
        "Falta AWS_REGION (o AWS_DEFAULT_REGION) en variables de entorno."
      );
    }

    // Inicializa el cliente con la región configurada
    this.lambdaClient = new LambdaClient({ region });
  }

  /**
   * Invoca una Lambda por nombre y devuelve la respuesta en formato JSON.
   *
   * - functionName: nombre EXACTO de la Lambda en AWS
   * - payload: objeto que se serializa a JSON
   */
  async invokeLambda(
    functionName: string,
    payload: object
  ): Promise<LambdaJsonResponse> {
    // Construye el comando de invocación (RequestResponse = síncrono)
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
      InvocationType: "RequestResponse",
    });

    try {
      const response = await this.lambdaClient.send(command);

      // Si la Lambda hace throw, AWS puede marcar FunctionError
      if (response.FunctionError) {
        return {
          errorMessage: `Lambda FunctionError: ${response.FunctionError}`,
          body: response.Payload
            ? Buffer.from(response.Payload as Uint8Array).toString()
            : "",
        };
      }

      // El payload viene como bytes: lo convierte a string
      const raw = response.Payload
        ? Buffer.from(response.Payload as Uint8Array).toString()
        : "{}";

      // La respuesta de Lambda normalmente ya es un JSON con statusCode/body
      return JSON.parse(raw) as LambdaJsonResponse;
    } catch (error) {
      // Log de diagnóstico en caso de fallas de SDK/red/permisos
      console.error("Error al invocar la Lambda:", error);
      throw error;
    }
  }
}
