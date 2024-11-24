
import { CompilerApi, getChildrenFunction, getCompilerApi, Node, Program, SourceFile, TypeChecker } from "./compiler/index";
import { propertiesSampler } from "./propertiesSampler";
import { TreeMode } from "./types/index";
import { getSyntaxKindName } from "./utils/index";

export interface TreeViewerProps {
  api: CompilerApi;
  sourceFile: SourceFile;
  selectedNode: Node;
  onSelectNode: (node: Node) => void;
  mode: TreeMode;
  bindingTools: () => {
    typeChecker: TypeChecker;
    program: Program;
}
}

export async function treeSampler(props: TreeViewerProps) {
  const { api: initialApi, sourceFile, mode, bindingTools } = props;

  let api = initialApi || null


  const load = async () => {
    const loadedApi = await getCompilerApi("typescript");
    api = loadedApi;
  }
  load()

    const treeViewer = document.getElementById("treeViewer");
    const innerSelectedNode = document.querySelector(`#treeViewer .selected`);
    if (treeViewer && innerSelectedNode) {
      const selectedRect = innerSelectedNode.getBoundingClientRect();
      const treeViewerRect = treeViewer.getBoundingClientRect();
      if (selectedRect.y < 0 || selectedRect.y + selectedRect.height > treeViewerRect.height) {
        innerSelectedNode.scrollIntoView({ block: "center", inline: "center" });
      }
    }
  return await renderNode(sourceFile, await getChildrenFunction(mode, sourceFile) as any)

  async function renderNode(node: Node, getChildren: (node: Node) => Node[]) {
   
    const children = getChildren(node);
    const kindName = getSyntaxKindName(api, node.kind);

    const displayNode= await propertiesSampler({
      api: initialApi,
      sourceFile: sourceFile,
      bindingTools: bindingTools,
      selectedNode: node,
    }).catch()

    if (children.length === 0) {
      return kindName
    } else {
      const map = []
      const calls = children.map(async (n) => {
       const renderedNode = await  renderNode(n, getChildren)
       map.push(renderedNode)
    })
      Promise.all(calls)
      return (
        {
          "__node": displayNode,
          [kindName]: map
         }
      );
    }
  }
}
