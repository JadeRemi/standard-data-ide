export declare function checkIframeContent({ iframeSel, pathArray, expected, node }: {
    iframeSel?: string;
    pathArray: string[];
    expected: string;
    node: Element;
}): {
    result: {
        expected: string;
        received: string;
        nodeParams?: unknown;
        children?: unknown;
    };
    success: boolean;
};
