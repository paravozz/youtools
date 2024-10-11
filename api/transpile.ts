import { transpileModule, ModuleKind } from "typescript";


export async function POST(request: Request) {
  const source = await request.text();

  let result = transpileModule(source, { compilerOptions: { module: ModuleKind.ESNext }});

  return new Response(result.outputText, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const config = {
  runtime: 'nodejs',
};
