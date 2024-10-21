

get js emitted from ts-compiler.

```ts
function api_compileTS(): Promise<string>
```

```js
top.api_compileTS().then(console.log)
```

add d.ts file.

```ts
function api_addModuleDeclaration(url: string, moduleName: string): Promise<any>
```

get html output string from sandbox.

```ts
function api_makeSandCode(mode?: "dev" | "pro"): Promise<string>
```

update tsconfig

```ts
function api_updateCompilerOptions(options): void
```
