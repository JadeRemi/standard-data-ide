import { EditorAPI } from '../core';
import { TSX } from '../lib/types';
interface IframeTestProps {
    editor: EditorAPI;
    consoleRef: TSX.RefObj<HTMLDivElement>;
}
declare const IframeTest: ({ consoleRef }: IframeTestProps) => any;
export default IframeTest;
