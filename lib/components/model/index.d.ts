import './style.css';
import { JSX } from '../../lib/types';
type ModelAPI = {
    close: Function;
};
export declare const openModel: (message: (api: ModelAPI) => JSX.Element) => {
    close: () => void;
};
export {};
