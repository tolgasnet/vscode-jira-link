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

    private _statusBarItem: StatusBarItem;
    private _urlCommand: Disposable;
    private _ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
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
                var jiraStory = this.getJiraStory(branchName);
                if (jiraStory.Name.length === 0) {
                    this._statusBarItem.hide();
                    return;
                }

                this._urlCommand = commands.registerCommand('extension.jiraLinkCommand', function () {
                    opn(jiraStory.Url);
                });

                this._statusBarItem.command = "extension.jiraLinkCommand";
                this._statusBarItem.text = `$(tag) JIRA`;
                this._statusBarItem.show();
            });
    }

    public getJiraStory(branchName: string) : JiraStory {
        var namePattern = /feature\/(.*)\/.*/g;
        var match = namePattern.exec("feature/PROJ-123/test");
        while(match === null) {
            return { Name: "", Url: "" };
        }
        var storyNumber = match[1];

        var jiraBaseUri = this._ctx.workspaceState.get<string>("jira-uri", "");
        var self = this;
        if (jiraBaseUri.length === 0) {
            window
                .showInputBox({ value: "JIRA host ie. https://mydomain.attlassian.net" })
                .then<string>((value) => { 
                    jiraBaseUri = value; 
                    this._ctx.workspaceState.update("jira-uri", jiraBaseUri);
                    window.showInformationMessage(jiraBaseUri);
                    return value;
                });
        }

        var jiraUrl = `https://changeme.atlassian.net/browse/${storyNumber}`;

        return { Name: storyNumber, Url: jiraUrl };
    }

    public readJson(path: string, done) {
        var configValues;
        fs.readFile(path, 'utf8', function (err, data) {
            configValues = err ? "none" : JSON.parse(data); 
            done(configValues);
        });
    }

    public dispose() {
        this._statusBarItem.dispose();
        this._urlCommand.dispose();
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
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._jiraLink.updateJiraLink();
    }

    public dispose() {
        this._disposable.dispose();
    }
}