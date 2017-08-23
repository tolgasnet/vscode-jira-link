import { StatusBarItem, StatusBarAlignment, window } from 'vscode';

export class StatusBar {

    private _statusBarItem: StatusBarItem;

    public Error(branchName: string, storyNumber: string) {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        this._statusBarItem.command = null;
        this._statusBarItem.text = `$(issue-opened) JIRA`;
        this._statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${storyNumber}`;
        this._statusBarItem.show();
    }

    public show(jiraUrl: string) {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        this._statusBarItem.command = "extension.jiraBrowseLinkCommand";
        this._statusBarItem.text = `$(link-external) JIRA`;
        this._statusBarItem.tooltip = jiraUrl;
        this._statusBarItem.show();
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}