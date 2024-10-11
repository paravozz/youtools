#!/usr/bin/env node
import { Command } from "commander";

import packageJson from "../package.json";

import { add } from "@/src/commands/add";
import { init } from "@/src/commands/init";


process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));


async function main() {
  const program = new Command()
    .name("youtools")
    .description("add utils to your project without creating a load of dependencies")
    .version(
      packageJson.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program.addCommand(init).addCommand(add);

  program.parse();
}


void main();
