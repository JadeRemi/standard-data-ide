
import {
  CommentRange,
  CompilerApi,
  getPublicApiInfo,
  getStartSafe,
  Node,
  PublicApiInfo,
  Signature,
  SourceFile,
  Symbol,
  Type,
  TypeChecker,
} from "./compiler";
import { BindingTools } from "./types";
import { enumUtils, getSyntaxKindName } from "./utils";

export interface PropertiesViewerProps {
  api: CompilerApi;
  sourceFile: SourceFile;
  bindingTools: () => BindingTools;
  selectedNode: Node;
}

export async function propertiesSampler(props: PropertiesViewerProps) {
 



    const publicApiInfo = await getPublicApiInfo("typescript")
  const { selectedNode, sourceFile, bindingTools } = props;
  const context: Context = {
    api: props.api,
    publicApiInfo,
    sourceFile,
  };

  return ({
        Node: getForSelectedNode(context, selectedNode),
        Binding: getBindingSection(context, selectedNode, bindingTools()?.typeChecker)
  })
}

interface Context {
  api: CompilerApi;
  publicApiInfo: PublicApiInfo | undefined | false;
 sourceFile: SourceFile;
}

function getBindingSection(context: Context, selectedNode: Node, typeChecker: TypeChecker) {
  return (
    {
      Type: getForType(context, selectedNode, typeChecker),
      Symbol: getForSymbol(context, selectedNode, typeChecker),
    }
  );
}

function getForSelectedNode(context: Context, selectedNode: Node) {
  return ({
    [getSyntaxKindName(context.api, selectedNode.kind)]:getChildren()

});

  function getChildren() {
    const { sourceFile } = context;
    return ({
        properties: getProperties(context, selectedNode),
        "getChildCount()": selectedNode.getChildCount(sourceFile),
        "getFullStart()": getPositionElement(sourceFile, selectedNode.getFullStart()),
        "getStart()": getPositionElement(sourceFile, selectedNode.getStart(sourceFile)),
        "getStart(sourceFile, true)": getPositionElement(sourceFile, getStartSafe(selectedNode, sourceFile)),
        
        "getFullWidth()": selectedNode.getFullWidth(),
        "getWidth()": selectedNode.getWidth(sourceFile),
        "getLeadingTriviaWidth()": selectedNode.getLeadingTriviaWidth(sourceFile),
        "getFullText()": selectedNode.getFullText(sourceFile),
        /* Need to do this because internally typescript doesn't pass the sourceFile to getStart() in TokenOrIdentifierObject (bug in ts I need to report...) */
    
        "getText()":sourceFile.text.substring(selectedNode.getStart(context.sourceFile), selectedNode.getEnd()),
      
        
         [`ts.getLeadingCommentRanges(fileFullText, ${selectedNode.getFullStart()})`]:
          context.api.getLeadingCommentRanges(context.sourceFile.text, selectedNode.getFullStart()),
       

          [`ts.getTrailingCommentRanges(fileFullText, ${selectedNode.end})`]:
          context.api.getTrailingCommentRanges(context.sourceFile.text, selectedNode.end),
        })
    
  }

  function getMethodElement(name: string, result: string | number) {
    return getTextDiv(name, typeof result === "number" ? JSON.stringify(result) : result);
  }

  function getForCommentRanges(name: string, commentRanges: CommentRange[] | undefined) {
    if (commentRanges == null) {
      return getTextDiv(name, "undefined");
    } else {
      return getArrayDiv(context, name, commentRanges);
    }
  }
}

function getForType(context: Context, node: Node, typeChecker: TypeChecker) {
  if (node.kind === context.api.SyntaxKind.SourceFile) {
    return "None";
  }

  const type = getOrReturnError(() => typeChecker.getTypeAtLocation(node));
  if (type == null) {
    return "None";
  }
  if (typeof type === "string") {
    return `Error getting type: ${type}`;
  }

  return getTreeView(context, type, getTypeToString() || "Type");

  function getTypeToString() {
    try {
      return typeChecker.typeToString(type as Type, node);
    } catch (err) {
      return `[Problem getting type text: ${err}]`;
    }
  }
}

function getForSymbol(context: Context, node: Node, typeChecker: TypeChecker) {
  const symbol = getOrReturnError(() =>
    ((node as any).symbol as Symbol | undefined) || typeChecker.getSymbolAtLocation(node)
  );
  if (symbol == null) {
    return "None";
  }
  if (typeof symbol === "string") {
    return `Error getting symbol: ${symbol}`;
  }

  return getTreeView(context, symbol, getSymbolName() || "Symbol");

  function getSymbolName() {
    try {
      return (symbol as Symbol).getName();
    } catch (err) {
      return `[Problem getting symbol name: ${err}]`;
    }
  }
}

function getOrReturnError<T>(getFunc: () => T): T | string {
  try {
    return getFunc();
  } catch (err) {
    return JSON.stringify(err);
  }
}

function getTreeView(context: Context, obj: any, label: string) {
  return ({
[label]: getProperties(context, obj)
  })

}

function  getGeneralProperties(context: Context, obj: any) {
  const keyInfo = getProperties(context, obj);
  const hashMap = {}
  for (const key of Object.values(keyInfo)) {
    if ((typeof key !== "object")) return;
    const [[keyDeepValue1, keyDeepValue2]] = Object.entries(key)
    hashMap[keyDeepValue1 as any] = keyDeepValue2
  }
  return hashMap
}

function getProperties(context: Context, obj: any) {
  const keyInfo = getObjectKeyInfo(context, obj);

  const values = keyInfo.map((info) => getNodeKeyValue(info.key, info.value, obj)

  );
  return values;

  function getNodeKeyValue(key: string, value: any, parent: any) {
    if (value === null) {
      return getTextDiv(key, "null");
    } else if (value === undefined) {
      return getTextDiv(key, "undefined");
    } else if (value instanceof Array) {
      return getArrayDiv(context, key, value);
    } else if (isTsNode(value)) {
      return getNodeDiv(context, key, value);
    } else if (isMap(value)) {
      return getMapDiv(context, key, value);
    } else if (typeof value === "object") {
      return getObjectDiv(context, key, value);
    } else {
      return getCustomValueDiv(context, key, value, parent);
    }
  }
}

function getArrayDiv(context: Context, key: string, value: unknown[]) {
  if (value.length === 0) {
    return getTextDiv(key, "[]");
  } else {
    return (
      {[key]: value.map((v, i) => getTreeNode(context, v, undefined, i))}
    );
  }
}

function getMapDiv(context: Context, key: string, value: ReadonlyMap<string, unknown>) {
  const entries = Array.from(value.entries());
  if (entries.length === 0) {
    return getTextDiv(key, "{}");
  } else {
    return (
      {key: entries.map((v, i) => getTreeNode(context, v[1], v[0], i))}
    );
  }
}

function getObjectDiv(context: Context, key: string, value: unknown) {
  if (getObjectKeyInfo(context, value).length === 0) {
    return getTextDiv(key, "{}");
  } else {
    return ({
      [key] : getTreeNode(context, value)
  });
  }
}

function getCustomValueDiv(context: Context, key: string, value: any, parent: any) {
  return ({
      [key]: getCustomValue()
  }
  );

  function getCustomValue() {
    if (isTsNode(parent)) {
      switch (key) {
        case "kind":
        case "token":
          return `${value} (SyntaxKind.${getSyntaxKindName(context.api, value)})`;
        case "flags":
          return getEnumFlagElement(context.api.NodeFlags, value);
        case "pos":
        case "end":
          return getPositionElement(context.sourceFile, value);
        case "transformFlags":
          return getEnumFlagElement(context.api.TransformFlags, value);
        case "modifierFlagsCache":
          return getEnumFlagElement(context.api.ModifierFlags, value);
      }
    }
    if (isTsType(parent) && key === "objectFlags") {
      return getEnumFlagElement(context.api.ObjectFlags, value);
    }
    if (isTsType(parent) && key === "flags") {
      return getEnumFlagElement(context.api.TypeFlags, value);
    }
    if (isTsSymbol(parent) && key === "flags") {
      return getEnumFlagElement(context.api.SymbolFlags, value);
    }
    // TS pre-5.0 puts this on the symbol, TS 5.0 puts it on a plain "links" object
    if (key === "checkFlags" && typeof value === "number") {
      return getEnumFlagElement(context.api.CheckFlags, value);
    }
    if (key === "kind" && typeof value === "number") {
      return getEnumFlagElement(context.api.TypeMapKind, value);
    }
    if (isFlowNode(parent) && key === "flags") {
      return getEnumFlagElement((context.api as any)?.FlowFlags, value);
    }
    return;
  }
}

function getNodeDiv(context: Context, key: string, value: Node) {
  return (
    {[key]: getTreeNode(context, value)}
  );
}

function getTextDiv(key: string | undefined, value: string) {
  return ({
      [key]: value
  });
}

function getTreeNode(context: Context, value: any, key?: string, index?: number) {
  const labelName = getLabelName(context, value);
  key = getKey();

  if (typeof value === "string") {
    return getTextDiv(key, `"${value}"`);
  }
  if (typeof value === "number") {
    return getTextDiv(key, value.toString());
  }
  if (typeof value === "boolean") {
    return getTextDiv(key, value.toString());
  }
  return ({
      [key]: getProperties(context, value)
 });

  function getKey() {
    if (key == null) {
      return labelName;
    } else if (labelName != null) {
      return `${key}: ${getLabelName(context, value)}`;
    }
    return key;
  }
}

function getLabelName(context: Context, obj: any) {
  if (obj == null) {
    return undefined;
  }
  if (isTsNode(obj)) {
    return appendName(getSyntaxKindName(context.api, obj.kind));
  }
  if (isTsSignature(obj)) {
    return appendName("Signature");
  }
  if (isTsType(obj)) {
    return appendName("Type");
  }
  if (isTsSymbol(obj)) {
    return appendName("Symbol");
  }
  const objType = typeof obj;
  if (objType === "string" || objType === "number" || objType === "boolean") {
    return undefined;
  }
  return appendName("Object");

  function appendName(title: string) {
    const name = getName();
    return name == null ? title : `${title} (${name})`;
  }

  function getName() {
    try {
      if (typeof obj.getName === "function") {
        return obj.getName();
      }
      if (isTsNode(obj) && (obj as any).name != null) {
        const name = (obj as any).name as Node;
        return name.getText();
      }
      return undefined;
    } catch (_err) {
      return undefined;
    }
  }
}

function getObjectKeyInfo(context: Context, obj: any) {
  if (obj == null) {
    return [];
  }
  return Object.keys(obj)
    .map((key) => ({
      key,
      permission: getKeyPermission(context, obj, key),
      value: obj[key],
    }))
    .filter((kv) => {
      if (kv.permission === false) {
        return false;
      }
      return kv.permission !== "internal";
    });
}

const nodeDisallowedKeys = new Set(["parent", "_children", "symbol"]);
const typeDisallowedKeys = new Set(["checker", "symbol"]);
function getKeyPermission(context: Context, obj: any, key: string): true | false | "internal" | "" {
  const { publicApiInfo } = context;
  if (isTsNode(obj)) {
    if (nodeDisallowedKeys.has(key)) {
      return false;
    }
    if (!publicApiInfo) {
      return true;
    }
    const kindName = getSyntaxKindName(context.api, obj.kind);
    return hasInProperties(publicApiInfo.nodePropertiesBySyntaxKind.get(kindName));
  }
  if (isTsType(obj)) {
    return !typeDisallowedKeys.has(key) && hasInProperties(publicApiInfo && publicApiInfo.typeProperties);
  }
  if (isTsSignature(obj)) {
    return hasInProperties(publicApiInfo && publicApiInfo.signatureProperties);
  }
  if (isTsSymbol(obj)) {
    return hasInProperties(publicApiInfo && publicApiInfo.symbolProperties);
  }
  return true;

  function hasInProperties(publicApiProperties: Set<string> | undefined | false) {
    if (!publicApiProperties) {
      return true;
    }
    return publicApiProperties.has(key) ? true : "internal";
  }
}

function isMap(value: any): value is ReadonlyMap<string, unknown> {
  return typeof value.keys === "function" &&
    typeof value.values === "function";
}

function isTsNode(value: any): value is Node {
  return typeof (value as Node).kind === "number" && typeof (value as Node).flags === "number";
}

function isTsType(value: any): value is Type {
  return (value as Type).getBaseTypes != null;
}

function isTsSymbol(value: any): value is Symbol {
  return (value as Symbol).getDeclarations != null;
}

function isTsSignature(value: any): value is Signature {
  if (value.declaration == null) {
    return false;
  }
  return isTsNode(value.declaration);
}

function isFlowNode(value: any) {
  return value.antecedents != null || value.antecedent != null;
}

function getEnumFlagElement(enumObj: any, value: number) {
  const elements = enumUtils.getEnumFlagLines(enumObj, value);
  if (!elements) {
    return {enumFlags: value};
  }

  return (
    {
      enumflags: value.toString(),
      flagList: elements.map((el, i) => ({
        [i]: el}))
    }
  );
}

function getPositionElement(sourceFile: SourceFile, pos: number) {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
  return ({
    position: pos.toString(),
    line:  line + 1,
    column: character + 1
  }
  );
}
