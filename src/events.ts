import { window, commands, Disposable } from 'vscode';
import { JiraLink } from './jiralink';
import { BranchPattern } from './config/branch-pattern';

export class Events {
    
        private _jiraLink: JiraLink;
        private _subscriptions: Disposable[] = [];
        private _branchPattern: BranchPattern;
    
        constructor(jiraLink: JiraLink, branchPattern: BranchPattern) {
            this._jiraLink = jiraLink;
            this._branchPattern = branchPattern;
    
            window.onDidChangeActiveTextEditor(this._jiraLink.updateJiraLink, this, this._subscriptions);

            this.registerCommand('extension.jiraBrowseLinkCommand', 
                () => this._jiraLink.openJiraLink());

            this.registerCommand('extension.setJiraBaseUrlCommand', 
                () => this._jiraLink.setBaseUrl());

            this.registerCommand('extension.setBranchPatternCommand', 
                () => this._branchPattern.set(() => this._jiraLink.updateJiraLink()));
        }
    
        public dispose() {
            Disposable.from(...this._subscriptions).dispose();
        }

        private registerCommand(command: string, callback: (...args: any[]) => any) {
            var disposible = commands.registerCommand(command, callback, this);
            this._subscriptions.push(disposible);
        }
    }