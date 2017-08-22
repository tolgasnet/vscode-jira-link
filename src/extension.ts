import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, InputBoxOptions } from 'vscode';
var path = require('path');
var getGitBranchName = require('git-branch-name');
var opn = require('opn');
var fs = require('fs');

export function activate(ctx: ExtensionContext) {

    let jiraLink = new JiraLink(ctx);
    let controller = new JiraLinkController(jiraLink);

    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(jiraLink);
}

export class JiraLink {

    private _jiraUriStorageKey: string = "jira-uri";
    private _statusBarItem: StatusBarItem;
    private _ctx: ExtensionContext;
    private _jiraStory: JiraStory;

    constructor(ctx: ExtensionContext) {
        this._jiraStory = { Name: "", Url: "" };
        this._ctx = ctx;
    }

    public updateJiraLink() {
        
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        } 

        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        getGitBranchName(
            path.resolve(__dirname, '../../'), 
            (err, branchName) => {
                this._jiraStory = this.getJiraStory(branchName);
                if (this._jiraStory.Name.length === 0) {
                    this._statusBarItem.hide();
                    return;
                }

                this._statusBarItem.command = "extension.jiraBrowseLinkCommand";
                this._statusBarItem.text = `$(tag) JIRA`;
                this._statusBarItem.show();
            });
    }

    public openJiraLink() {
        opn(this._jiraStory.Url);
    }

    private getJiraStory(branchName: string) : JiraStory {
        var namePattern = /feature\/(.*)\/.*/g;
        var match = namePattern.exec(branchName);
        while(match === null) {
            return { Name: "", Url: "" };
        }
        var storyNumber = match[1];

        var jiraBaseUri = this.getJiraUri();
        if (jiraBaseUri.length === 0) {
            this.setBaseUrl();
        }

        var jiraUrl = `${jiraBaseUri}/browse/${storyNumber}`;

        return { Name: storyNumber, Url: jiraUrl };
    }

    public setBaseUrl() {
        var jiraBaseUri = this.getJiraUri();
        var defaultUri = jiraBaseUri && jiraBaseUri.length > 0 ? jiraBaseUri : "https://mydomain.atlassian.net";
        var domainFragmentEndIndex = defaultUri.indexOf(".");

        window
            .showInputBox(
            {
                value: defaultUri,
                valueSelection: [8, domainFragmentEndIndex],
                prompt: "Enter your JIRA host base url"
            })
            .then((value) => {
                if (!value) return;

                this._ctx.workspaceState
                    .update(this._jiraUriStorageKey, value)
                    .then(
                        (isSuccessful) => {
                            if (isSuccessful) {
                                window.showInformationMessage(`JIRA base url is updated as ${value}`);
                                this.updateJiraLink();
                            }
                        }
                    );
            });
    }

    private getJiraUri(): string {
        return this._ctx.workspaceState.get<string>(this._jiraUriStorageKey, "");
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class JiraStory {
    public Url: string;
    public Name: string;
}

class JiraLinkController {

    private _jiraLink: JiraLink;
    private _disposable: Disposable;

    constructor(jiraLink: JiraLink) {
        this._jiraLink = jiraLink;
        this._jiraLink.updateJiraLink();

        let subscriptions: Disposable[] = [];
        window.onDidChangeActiveTextEditor(this._onActiveEditorChangedEvent, this, subscriptions);

        var clickUrlCommand = commands.registerCommand('extension.jiraBrowseLinkCommand', this._onClickJiraLinkEvent, this);

        var setUrlCommand = commands.registerCommand('extension.setJiraBaseUrlCommand', this._onSetBaseUrl, this);

        this._disposable = Disposable.from(...subscriptions, clickUrlCommand, setUrlCommand);
    }

    private _onActiveEditorChangedEvent() {
        this._jiraLink.updateJiraLink();
    }

    private _onClickJiraLinkEvent() {
        this._jiraLink.openJiraLink();
    }

    private _onSetBaseUrl() {
        this._jiraLink.setBaseUrl();
    }

    public dispose() {
        this._disposable.dispose();
    }
}