import ts, { CompilerOptions, ModuleKind, ScriptTarget } from "typescript";


export function compileTsToJs(tsFilePath: string, outputDir: string) {
  const compilerOptions: CompilerOptions = {
    module: ModuleKind.ESNext,
    target: ScriptTarget.ESNext,
    declaration: false,
    outDir: outputDir
  };

  const program = ts.createProgram([tsFilePath], compilerOptions);
  program.emit();
}
