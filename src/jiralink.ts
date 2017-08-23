import { StatusBarItem, ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';
var opn = require('opn');

export class JiraLink {
    
        private _statusBarItem: StatusBarItem;
        private _ctx: ExtensionContext;
        private _jiraStory: JiraStory;
        private _git: Git;
        private _branchPattern: BranchPattern;
        private _jiraDomain: JiraDomain;
    
        constructor(
            ctx: ExtensionContext, 
            branchPattern: BranchPattern, 
            jiraDomain: JiraDomain) {

            this._jiraStory = { Name: "", Url: "" };
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
    
        public openWithBrowser() {
            opn(this._jiraStory.Url);
        }
    
        private getJiraStory(branchName: string) : JiraStory {
            let storyNumber = this._branchPattern.match(branchName);

            if (storyNumber.length === 0) {
                return { Name: "", Url: "" };
            }
    
            var jiraBaseUri = this._jiraDomain.get();
            if (jiraBaseUri.length === 0) {
                this._jiraDomain.showInputBox(() => this.updateJiraLink());
            }
    
            var jiraUrl = `${jiraBaseUri}/browse/${storyNumber}`;
    
            return { Name: storyNumber, Url: jiraUrl };
        }
    
        public dispose() {
            this._statusBarItem.dispose();
        }
    }
    
    class JiraStory {
        public Url: string;
        public Name: string;
    }