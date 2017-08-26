import { ExtensionContext, StatusBarAlignment, window, workspace } from 'vscode';
import { Git } from './git';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';
import { StatusBar } from './status-bar';
import { UrlBuilder } from './url-builder';
var opn = require('opn');

export class JiraLink {
    
        private _statusBar: StatusBar;
        private _jiraUrl: string = "";
        private _git: Git;
        private _branchPattern: BranchPattern;
        private _jiraDomain: JiraDomain;
        private _urlBuilder: UrlBuilder;
    
        constructor(
            branchPattern: BranchPattern, 
            jiraDomain: JiraDomain) {

            this._branchPattern = branchPattern;
            this._jiraDomain = jiraDomain;
            this._statusBar = new StatusBar();
            this._git = new Git();
            this._urlBuilder = new UrlBuilder(branchPattern, jiraDomain);
        }

        public initialize() {
            this._jiraDomain.initialize(() => this.update());
        }
    
        public update() {
            this._git.getCurrentBranch(
                workspace.rootPath,
                (branchName) => this.updateStatusBar(branchName)
            );
        }
    
        public browse() {
            opn(this._jiraUrl);
        }

        public dispose() {
            this._statusBar.dispose();
        }

        private updateStatusBar(branchName: string) {
            this._jiraUrl = this._urlBuilder.build(branchName);
            if (this._jiraUrl.length === 0) {
                this._statusBar.error(branchName, this._branchPattern.get().source);
                return;
            }

            this._statusBar.show(this._jiraUrl);
        }
    }