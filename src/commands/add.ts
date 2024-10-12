import { Command } from "commander";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { AddOptionsSchema, ConfigSchema } from "@/src/lib/schemas";
import { handleError } from "@/src/lib/utils/handle-error";
import { highlighter } from "@/src/lib/utils/highlighter";
import { logger } from "@/src/lib/utils/logger";
import { stringBooleanCheck } from "@/src/lib/utils/string-boolean-check";
import {fetchFromRegistry} from "@/src/lib/utils/fetch-from-registry";
import {remoteTranspileToJs} from "@/src/lib/utils/remote-transpile-to-js";


const isTsConfigExists = () => existsSync('tsconfig.json');

function createRegisterOptionOverride() {
  const overriddenOptionNames = new Set();

  function registerOptionOverride(optionName: string) {
    overriddenOptionNames.add(optionName);
  }

  function isOptionOverridden(optionName: string) {
    return overriddenOptionNames.has(optionName);
  }

  return { registerOptionOverride, isOptionOverridden };
}

const { registerOptionOverride, isOptionOverridden } = createRegisterOptionOverride();

function booleanOptionParser(optionName: string, value: string): boolean {
  registerOptionOverride(optionName);

  return stringBooleanCheck(value);
}

function stringOptionParser(optionName: string, value: string): string {
  registerOptionOverride(optionName);

  return value;
}


export const add = new Command()
  .name("add")
  .description("add an util to your project")
  .argument(
    "[utils...]",
    "the utils to add"
  )
  .option("-t, --typescript <bool>", "use typescript (tsconfig should exist in project).", (v) => booleanOptionParser("typescript", v), true)
  .option("-o, --overwrite <bool>", "overwrite existing files.", (v) => booleanOptionParser("overwrite", v), false)
  .option("-a, --appendToIndex <bool>", "append to utils index file", (v) => booleanOptionParser("appendToIndex", v), true)
  .option("-p, --path <path>", "the path to add the util to.", (v: string) => stringOptionParser("path", v))
  .option("-s, --silent", "mute output.", (v) => booleanOptionParser("silent", v), false)
  .action(async (utils, opts) => {
    try {
      const parsedOptions = AddOptionsSchema.parse({
        utils,
        ...opts,
      });
      const configPath = path.join(process.cwd(), 'youtools.json');

      let options = parsedOptions;

      try {
        if (existsSync(configPath)) {
          const config = ConfigSchema.parse(JSON.parse(readFileSync(configPath).toString()));

          const mergedOptions: { [key: string]: any } = {};
          for (const [key, value] of Object.entries(config)) {
            mergedOptions[key] = (
              isOptionOverridden(key)
                ? parsedOptions[key as keyof typeof parsedOptions]
                : value
            );
          }

          options = AddOptionsSchema.parse({ ...parsedOptions, ...mergedOptions });
        }
      } catch (error) {
        logger.error(`Configuration file ${highlighter.bold(configPath)} malformed. Either fix or remove it.`);

        handleError(error);
      }

      const isTypeScriptProject = options.typescript && isTsConfigExists();

      for (const utilName of utils) {
        const fileContent = await fetchFromRegistry(utilName);
        if (!fileContent) {
          logger.error(`Failed to fetch the file ${utilName}.ts`);
          continue;
        }

        // const srcTsFilePath = path.join(__dirname, 'src', 'tools', `${utilName}.ts`);
        const outputDir = options.path || path.join(process.cwd(), 'lib', 'utils');
        const outputExt = isTypeScriptProject ? "ts" : "js";
        const outputFileName = `${utilName}.${outputExt}`;
        const outputFilePath = path.join(outputDir, outputFileName);

        if (existsSync(outputFilePath)) {
          if (options.overwrite) {
            if (!options.silent) {
              logger.info(`${highlighter.bold(outputFileName)} already exist, but will be overwritten.`);
            }
          } else {
            if (!options.silent) {
              logger.info(`Skipping ${utilName}, because overwrite is disabled.`);
            }
            continue;
          }
        }

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }

        let contentToWrite = fileContent;

        if (!isTypeScriptProject) {
          const transpiledFileContent = await remoteTranspileToJs(fileContent);
          if (!transpiledFileContent) {
            if (!options.silent) {
              logger.warn("Error while transpiling typescript file to js. Will use ts file.");
            }
          } else {
            contentToWrite = transpiledFileContent;
          }
        }

        writeFileSync(outputFilePath, contentToWrite);

        if (!options.silent) {
          logger.info(`Copied ${highlighter.bold(outputFileName)} to ${highlighter.bold(outputDir)}.`);
        }

        if (options.appendToIndex) {
          const indexFile = path.join(outputDir, isTypeScriptProject ? 'index.ts' : "index.js");
          const exportLine = `export * from './${utilName}';`;

          if (existsSync(indexFile)) {
            const content = readFileSync(indexFile);
            if (!content.includes(exportLine)) {
              appendFileSync(indexFile, `${exportLine}\n`);
            }
          } else {
            appendFileSync(indexFile, `${exportLine}\n`);
          }
        }

        if (!options.silent) {
          logger.success(`Util ${highlighter.accent(utilName)} has been added successfully.\n`);
        }
      }

      if (!options.silent && utils.length > 1) {
        logger.success(`${highlighter.warn("---")}\n\nAll utils has been added successfully.`);
      }
    } catch (error) {
      logger.break();

      handleError(error);
    }
  });
