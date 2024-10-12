import { Command } from "commander";
import { existsSync, writeFileSync } from "fs";
import path from "path";

import { InitOptionsSchema } from "@/src/lib/schemas";
import { handleError } from "@/src/lib/utils/handle-error";
import { logger } from "@/src/lib/utils/logger";
import { stringBooleanCheck } from "@/src/lib/utils/string-boolean-check";
import {highlighter} from "@/src/lib/utils/highlighter";

const isTsConfigExists = () => existsSync('tsconfig.json');


export const init = new Command()
  .name("init")
  .description("init a default youtools config in your project")
  .option("-t, --typescript <bool>", "use typescript (tsconfig should exist in project).", stringBooleanCheck, true)
  .option("-o, --overwrite <bool>", "overwrite existing files.", stringBooleanCheck, false)
  .option("-a, --appendToIndex <bool>", "append to utils index file", stringBooleanCheck, true)
  .option("-p, --path <path>", "the path to add the utils to.", "lib/utils")
  .option("-s, --silent <bool>", "mute output.", stringBooleanCheck, false)
  .action(async (opts) => {
    try {
      const configPath = path.join(process.cwd(), 'youtools.json');

      // Check if the config file already exists
      if (existsSync(configPath)) {
        logger.error(`Configuration file ${highlighter.bold(configPath)} already exists.`);

        return;
      }

      // Create the default config object
      const config = InitOptionsSchema.parse(opts);

      config.typescript = config.typescript && isTsConfigExists();

      // Write the config object to youtools.json
      writeFileSync(configPath, JSON.stringify(config, null, 2));
      logger.success(`Created configuration file ${highlighter.bold(configPath)}`);
    } catch (error) {
      logger.break();

      handleError(error);
    }
  });
