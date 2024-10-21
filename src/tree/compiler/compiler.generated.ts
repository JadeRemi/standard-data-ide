

import {
  CompilerPackageNames,
} from "./compilerVersions.generated";
import { CompilerApi, Node } from "./CompilerApi";
import { assertNever } from "../utils/index";

export async function importCompilerApi(packageName: CompilerPackageNames) {
  switch (packageName) {
    case "typescript":
      return await import("typescript");
    default:
      return assertNever(
        packageName,
        `Not implemented version: ${packageName}`,
      );
  }
}

export async function importLibFiles(packageName: CompilerPackageNames) {
 switch (packageName) {
    case "typescript":
      return await import("../resources/libFiles/typescript/index");
    default:
      return assertNever(
        packageName,
        `Not implemented version: ${packageName}`,
      );
  }
}

export type FactoryCodeGenerator = (ts: CompilerApi, node: Node) => string;

export async function getGenerateFactoryCodeFunction(
  packageName: CompilerPackageNames,
): Promise<FactoryCodeGenerator> {
  switch (packageName) {
    case "typescript":
      return (await import("../resources/factoryCode/typescript.generated"))
        .generateFactoryCode as any;
    default:
      return assertNever(
        packageName,
        `Not implemented version: ${packageName}`,
      );
  }
}

export interface PublicApiInfo {
  nodePropertiesBySyntaxKind: Map<string, Set<string>>;
  symbolProperties: Set<string>;
  typeProperties: Set<string>;
  signatureProperties: Set<string>;
}

export async function getPublicApiInfo(
  packageName: CompilerPackageNames,
): Promise<PublicApiInfo> {
 switch (packageName) {
    case "typescript":
      return (await import(
        "../resources/publicApiInfo/typescript.generated"
      ));
    default:
      return assertNever(
        packageName,
        `Not implemented version: ${packageName}`,
      );
  }
}
