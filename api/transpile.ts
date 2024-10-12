import { ModuleKind, ScriptTarget, transpileModule } from "typescript";


export async function POST(request: Request) {
  const source = await request.text();

  let result = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ESNext }});

  return new Response(result.outputText, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
