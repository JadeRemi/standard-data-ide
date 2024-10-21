import { useLayoutEffect } from "react";
import TreeView from "react-treeview";
import { CompilerApi, getChildrenFunction, getCompilerApi, Node, SourceFile } from "./compiler/index";
import { TreeMode } from "./types/index";
import { getSyntaxKindName } from "./utils/index";
import React from '../../src/lib';
import { JSX } from "../lib/types";

export interface TreeViewerProps {
  api: CompilerApi;
  sourceFile: SourceFile;
  selectedNode: Node;
  onSelectNode: (node: Node) => void;
  mode: TreeMode;
}

export function TreeViewer(props: TreeViewerProps) {
  const { sourceFile, selectedNode, onSelectNode, mode } = props;

  let api = null


  const load = async () => {
    const loadedApi = await getCompilerApi("typescript");
    api = loadedApi;
  }
  load()
  let i = 0;
  useLayoutEffect(() => {
   

    const treeViewer = document.getElementById("treeViewer");
    const selectedNode = document.querySelector(`#treeViewer .selected`);
    if (treeViewer && selectedNode) {
      const selectedRect = selectedNode.getBoundingClientRect();
      const treeViewerRect = treeViewer.getBoundingClientRect();
      if (selectedRect.y < 0 || selectedRect.y + selectedRect.height > treeViewerRect.height) {
        selectedNode.scrollIntoView({ block: "center", inline: "center" });
      }
    }
  }, [selectedNode]);
  return <div id="treeViewer">{renderNode(sourceFile, getChildrenFunction(mode, sourceFile) as any)}</div>;

  function renderNode(node: Node, getChildren: (node: Node) => Node[]): JSX.Element {
    const children = getChildren(node);
    const className = "nodeText" + (node === selectedNode ? " selected" : "");
    const kindName = getSyntaxKindName(api, node.kind);
    const label = <div onClick={() => onSelectNode(node)} className={className}>{kindName}</div>;
    if (children.length === 0) {
      return <div key={i++} className="endNode" data-name={kindName}>{label}</div>;
    } else {
      return (
        <div data-name={kindName} key={i++}>
          <TreeView nodeLabel={label}>
            {children.map((n) => renderNode(n, getChildren))}
          </TreeView>
        </div>
      );
    }
  }
}
