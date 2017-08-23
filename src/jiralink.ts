import { ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';
import { StatusBar } from './statusBar';
var opn = require('opn');

export class JiraLink {
    
        private _statusBar: StatusBar;
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
            this._statusBar = new StatusBar();
            this._git = new Git();
        }
    
        public updateJiraLink() {
            this._git.getCurrentBranch(
                workspace.rootPath,
                (branchName) => {
                    this._jiraUrl = this.buildUrl(branchName);
                    if (this._jiraUrl.length === 0) {
                        this._statusBar.Error(branchName, this._branchPattern.get().source);
                        return;
                    }

                    this._statusBar.show(this._jiraUrl);
                }
            );
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
            this._statusBar.dispose();
        }
    }