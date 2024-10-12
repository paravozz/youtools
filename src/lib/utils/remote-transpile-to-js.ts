import { logger } from "@/src/lib/utils/logger";
import { handleError } from "@/src/lib/utils/handle-error";


export async function remoteTranspileToJs(jsContent: string) {
  const url = process.env.TRANSPILE_URL;

  if (!url) {
    throw new Error("Remote transpiler URL not specified.");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: jsContent
    });

    if (!response.ok) {
      throw new Error(`Failed to transpile file`);
    }

    return await response.text();
  } catch (error) {
    logger.break();
    handleError(error);
  }
}
