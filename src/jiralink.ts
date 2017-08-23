import { StatusBarItem, ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
import { BranchPattern } from './config/branch-pattern';
var opn = require('opn');

export class JiraLink {
    
        private _jiraUriStorageKey: string = "jira-uri";
        private _statusBarItem: StatusBarItem;
        private _ctx: ExtensionContext;
        private _jiraStory: JiraStory;
        private _git: Git;
        private _branchPattern: BranchPattern;
    
        constructor(ctx: ExtensionContext, branchPattern: BranchPattern) {
            this._jiraStory = { Name: "", Url: "" };
            this._ctx = ctx;
            this._branchPattern = branchPattern;
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
                        this._statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${this._branchPattern.get().source}`;
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
            let storyNumber = this._branchPattern.match(branchName);

            if (storyNumber.length === 0) {
                return { Name: "", Url: "" };
            }
    
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