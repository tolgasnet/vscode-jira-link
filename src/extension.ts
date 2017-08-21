import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
var path = require('path');
var getGitBranchName = require('git-branch-name');

export function activate(ctx: ExtensionContext) {

    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter);

    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(wordCounter);
}

export class WordCounter {

    private _statusBarItem: StatusBarItem;

    public updateWordCount() {
        
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
                var jiraUrl = this.getJiraUrl(branchName);
                this._statusBarItem.text = `$(tag) ${jiraUrl}`;
                this._statusBarItem.show();
            });
    }

    public getJiraUrl(branchName: string) : string {
        return branchName;
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }

    public dispose() {
        this._disposable.dispose();
    }
}