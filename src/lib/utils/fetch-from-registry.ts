import packageJson from "../../../package.json";
import { logger } from "@/src/lib/utils/logger";
import { handleError } from "@/src/lib/utils/handle-error";
import { highlighter } from "@/src/lib/utils/highlighter";


const baseUrl = packageJson.repository.url.replace("github.com", "raw.githubusercontent.com").slice(0, -4)
const registryUrl = `${baseUrl}/main/src/tools`;

export async function fetchFromRegistry(toolName: string) {
  const url = `${registryUrl}/${toolName}.ts`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      logger.error(`Failed to fetch utility ${highlighter.bold(toolName)} from registry`);
      return null;
    }

    return await response.text();
  } catch (error) {
    logger.break();
    handleError(error);

    return null;
  }
}
