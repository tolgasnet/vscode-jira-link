import { StatusBarItem, ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
var opn = require('opn');

export class JiraLink {
    
        private _jiraUriStorageKey: string = "jira-uri";
        private _branchPatternStorageKey: string = "branch-pattern";
        private _statusBarItem: StatusBarItem;
        private _ctx: ExtensionContext;
        private _jiraStory: JiraStory;
        private _git: Git;
    
        constructor(ctx: ExtensionContext) {
            this._jiraStory = { Name: "", Url: "" };
            this._ctx = ctx;
            this._git = new Git();
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
    
            this._git.getCurrentBranch(
                workspace.rootPath,
                (branchName) => {
                    this._jiraStory = this.getJiraStory(branchName);
                    if (this._jiraStory.Name.length === 0) {
                        this._statusBarItem.command = null;
                        this._statusBarItem.text = `$(issue-opened) JIRA`;
                        this._statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${this.getBranchPatternRegExp().source}`;
                        this._statusBarItem.show();
                        return;
                    }
    
                    this._statusBarItem.command = "extension.jiraBrowseLinkCommand";
                    this._statusBarItem.text = `$(link-external) JIRA`;
                    this._statusBarItem.tooltip = this._jiraStory.Url;
                    this._statusBarItem.show();
                });
        }
    
        public openJiraLink() {
            opn(this._jiraStory.Url);
        }
    
        private getJiraStory(branchName: string) : JiraStory {
            var match = this.getBranchPatternRegExp().exec(branchName);
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
                    if (typeof value == 'undefined') return;
    
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
    
        public setBranchPattern() {
            var branchPattern = this.getBranchPatternRegExp();
    
            window
                .showInputBox(
                {
                    value: branchPattern.source,
                    prompt: "Enter your GIT branch pattern or set to empty to restore to default."
                })
                .then((value) => {
                    if (typeof value == 'undefined') return;
    
                    this._ctx.workspaceState
                        .update(this._branchPatternStorageKey, value)
                        .then(
                            (isSuccessful) => {
                                if (isSuccessful) {
                                    var updatedValue = value.length > 0 ? 
                                        `GIT branch pattern is updated as ${value}` : 
                                        "GIT branch pattern is restored to default.";
                                    window.showInformationMessage(`GIT branch pattern is updated as ${value}`);
                                    this.updateJiraLink();
                                }
                            }
                        );
                });
        }
    
        private getJiraUri(): string {
            return this._ctx.workspaceState.get<string>(this._jiraUriStorageKey, "");
        }
    
        private getBranchPatternRegExp(): RegExp {
            var branchPattern = this._ctx.workspaceState.get<string>(this._branchPatternStorageKey, "");
            return branchPattern.length > 0 ? new RegExp(branchPattern, "i") : /feature\/([a-zA-Z]{3}\-?[0-9]{3})/i;    
        }
    
        public dispose() {
            this._statusBarItem.dispose();
        }
    }
    
    class JiraStory {
        public Url: string;
        public Name: string;
    }