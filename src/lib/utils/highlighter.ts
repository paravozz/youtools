import { bold, cyan, green, magenta, red, yellow } from "kleur/colors";


export const highlighter = {
  error: red,
  warn: yellow,
  info: cyan,
  success: green,
  accent: (str: string) => magenta(bold(str)),
  bold
};
