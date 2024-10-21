export declare const readFile: (file: File) => Promise<FileInfo>;
export type FileInfo = {
    name: string;
    type: string;
    content: string;
};
