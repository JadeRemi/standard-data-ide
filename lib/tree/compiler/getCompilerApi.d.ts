import { CompilerApi } from "./CompilerApi";
import { CompilerPackageNames } from "./compilerVersions.generated";
export declare function getCompilerApi(packageName: CompilerPackageNames): Promise<CompilerApi>;
export declare function hasLoadedCompilerApi(packageName: CompilerPackageNames): boolean;
