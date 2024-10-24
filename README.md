# YOUTools
(**Y**our **O**wn **U**tility **Tools**)

![logo](logo.png?raw=true)

It's a ~~*utility library*~~ **collection of small utilities** that you can copy and paste into your app.

---
[![NPM version](https://img.shields.io/npm/v/youtools.svg?style=flat)](https://www.npmjs.org/package/youtools)
[![Tests](https://img.shields.io/github/actions/workflow/status/paravozz/youtools/node.js.yml)](https://github.com/paravozz/youtools/actions/workflows/node.js.yml)
---

Motivated by the fact that the current situation forces you to choose between micro-libraries
or big chunks of dependencies like Lodash.
I’m not against things like Lodash at all, but I believe it’s frustrating to:
- install lodash just for debounce;
- OR install separate debounce library;
- OR write debounce in one project and then copy it manually to every new one;
- OR rewrite debounce from scratch each time;

So this collection is something I’ll be using myself from project to project, and I’ll be happy if you want to use it too!

This thing is highly inspired by [shadcn/ui](https://ui.shadcn.com/) (I mean, I even used chunks of code)


## Usage

This collection is meant to be used with `npx`.
When you execute a command it will copy source file (or transpiled js file, if you opt out typescript) to your codebase.
You will be able to use, change, do whatever you want with it.

List of utils available [here](/src/tools)
If you didn't find util that you're looking for, then [check this](#contribution).

There are only 2 commands: init, add.
Each command has `-h` flag, so you can check how to use it.

### Config
You can **optionally** create a config file using

```bash
npx youtools@latest init
```

Options:
```
-t, --typescript <bool>     use typescript (tsconfig should exist in project). (default: true)
-o, --overwrite <bool>      overwrite existing files. (default: false)
-a, --appendToIndex <bool>  append to utils index file (default: true)
-p, --path <path>           the path to add the utils to. (default: "lib/utils")
-s, --silent <bool>         mute output. (default: false)
-h, --help                  display help for command
```

Default config looks like this:
```json
{
  "typescript": true,
  "overwrite": false,
  "appendToIndex": true,
  "path": "lib/utils",
  "silent": false
}
```

### Add
Use this to install specific util. You can install multiple at a time, space separated.
```bash
npx youtools@latest add [options] [utils...]
```

Options:
```
-t, --typescript <bool>     use typescript (tsconfig should exist in project). (default: true)
-o, --overwrite <bool>      overwrite existing files. (default: false)
-a, --appendToIndex <bool>  append to utils index file (default: true)
-p, --path <path>           the path to add the util to.
-s, --silent                mute output. (default: false)
-h, --help                  display help for command
```
If you use config file – options from config will override defaults, unless explicitly specified in command.

**Example:**
```bash
npx youtools@latest add left-pad
```
This will copy `left-pad.ts` to your `lib/utils` and append `export * from "./left-pad"` to `lib/utils/index.ts` file


## Contribution

Everyone is welcome to contribute.

I will be happy if you want to add your own util to collection.
Just fork repo, add util, add tests for it, create PR.
I will check and merge it asap!
