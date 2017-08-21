import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
var path = require('path');
var getGitBranchName = require('git-branch-name');
var opn = require('opn');

export function activate(ctx: ExtensionContext) {

    let wordCounter = new JiraLink();
    let controller = new WordCounterController(wordCounter);

    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(wordCounter);
}

export class JiraLink {

    private _statusBarItem: StatusBarItem;
    private _urlCommand: Disposable;

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
                this._statusBarItem.text = `$(tag) ${jiraStory.Name}`;
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
        var jiraUrl = `https://myjirahost.atlassian.net/browse/${storyNumber}`;

        return { Name: storyNumber, Url: jiraUrl };;
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

class WordCounterController {

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