const vs_lazy = () => { return require("vscode"); };

export const createStatusBarItem = (...args) => {
    return vs_lazy().window.createStatusBarItem(...args);
};

export const showInputBox = (...args) => {
    return vs_lazy().window.showInputBox(...args);
};

export const showInformationMessage = (...args) => {
    return vs_lazy().window.showInformationMessage(...args);
};

export const leftAlign = () => {
    return vs_lazy().StatusBarAlignment.Left;
};

export const workspaceRootPath = (): string => {
    return vs_lazy().workspace.rootPath;
};