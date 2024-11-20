
import { CompilerApi, getChildrenFunction, getCompilerApi, Node, SourceFile } from "./compiler/index";
import { TreeMode } from "./types/index";
import { getSyntaxKindName } from "./utils/index";

export interface TreeViewerProps {
  api: CompilerApi;
  sourceFile: SourceFile;
  selectedNode: Node;
  onSelectNode: (node: Node) => void;
  mode: TreeMode;
}

export function treeSampler(props: TreeViewerProps) {
  const { api: initialApi, sourceFile, mode } = props;

  let api = initialApi || null


  const load = async () => {
    const loadedApi = await getCompilerApi("typescript");
    api = loadedApi;
  }
  load()
  let i = 0;
    const treeViewer = document.getElementById("treeViewer");
    const innerSelectedNode = document.querySelector(`#treeViewer .selected`);
    if (treeViewer && innerSelectedNode) {
      const selectedRect = innerSelectedNode.getBoundingClientRect();
      const treeViewerRect = treeViewer.getBoundingClientRect();
      if (selectedRect.y < 0 || selectedRect.y + selectedRect.height > treeViewerRect.height) {
        innerSelectedNode.scrollIntoView({ block: "center", inline: "center" });
      }
    }
  return renderNode(sourceFile, getChildrenFunction(mode, sourceFile) as any)

  function renderNode(node: Node, getChildren: (node: Node) => Node[]): any {
    const children = getChildren(node);
    const kindName = getSyntaxKindName(api, node.kind);
    if (children.length === 0) {
      return kindName
    } else {
      return (
        {
          [kindName]: children.map((n) => renderNode(n, getChildren))
         }
      );
    }
  }
}
