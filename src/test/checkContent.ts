export function checkIframeContent({
    iframeSel = "iframe",
    pathArray,
    expected,
    node
}: {
    iframeSel?: string, 
    pathArray: string[], 
    expected: string;
    node: Element
}
  ): { result: { expected: string, received: string, nodeParams?: unknown, children?: unknown }, success: boolean } {
    try {
      const iframe = document.querySelector(iframeSel) as HTMLIFrameElement;
      if (!iframe) throw new Error("Iframe not found");
  
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) throw new Error("Iframe content not accessible");
  
      let currentElement: Document | Element | null = iframeDocument;
  
      for (const selector of pathArray) {
        currentElement = currentElement?.querySelector(selector) || null;
        if (!currentElement) throw new Error(`Element not found at step: ${selector}`);
      }
  
      const receivedContent = currentElement?.textContent?.trim() || "";

      const result = {
        expected,
        nodeParams: Object.values(node)[0],
        children: Object.values(node)[1]?.children,
        received: receivedContent
      }

  
      if (receivedContent === expected) {
        return {
          result,
          success: true,
        };
      } else {
        return {
          result,
          success: false,
        };
      }
    } catch (error) {
      return {
        result: { expected, received: error.message },
        success: false,
      };
    }
  }