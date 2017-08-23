import { StatusBarItem, ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';
var opn = require('opn');

export class JiraLink {
    
        private _statusBarItem: StatusBarItem;
        private _ctx: ExtensionContext;
        private _jiraUrl: string = "";
        private _git: Git;
        private _branchPattern: BranchPattern;
        private _jiraDomain: JiraDomain;
    
        constructor(
            ctx: ExtensionContext, 
            branchPattern: BranchPattern, 
            jiraDomain: JiraDomain) {

            this._ctx = ctx;
            this._branchPattern = branchPattern;
            this._jiraDomain = jiraDomain;
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
                    this._jiraUrl = this.buildUrl(branchName);
                    if (this._jiraUrl.length === 0) {
                        this._statusBarItem.command = null;
                        this._statusBarItem.text = `$(issue-opened) JIRA`;
                        this._statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${this._branchPattern.get().source}`;
                        this._statusBarItem.show();
                        return;
                    }
    
                    this._statusBarItem.command = "extension.jiraBrowseLinkCommand";
                    this._statusBarItem.text = `$(link-external) JIRA`;
                    this._statusBarItem.tooltip = this._jiraUrl;
                    this._statusBarItem.show();
                });
        }
    
        public openWithBrowser() {
            opn(this._jiraUrl);
        }
    
        private buildUrl(branchName: string) : string {
            let storyNumber = this._branchPattern.match(branchName);

            if (storyNumber.length === 0) {
                return "";
            }
    
            var jiraDomain = this._jiraDomain.get();
            if (jiraDomain.length === 0) {
                this._jiraDomain.showInputBox(() => this.updateJiraLink());
            }
    
            return `${jiraDomain}/browse/${storyNumber}`;
        }
    
        public dispose() {
            this._statusBarItem.dispose();
        }
    }