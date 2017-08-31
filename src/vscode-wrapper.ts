
export const createStatusBarItem = (...args) => {
    return vs_lazy().window.createStatusBarItem(...args);
};

export const leftAlign = () => {
    return vs_lazy().StatusBarAlignment.Left;
};

const vs_lazy = () => (require("vscode"));