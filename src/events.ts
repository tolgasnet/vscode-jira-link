import { window, commands, Disposable } from 'vscode';
import { JiraLink } from './jiralink';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export class Events {
    
        private _jiraLink: JiraLink;
        private _subscriptions: Disposable[] = [];
        private _branchPattern: BranchPattern;
        private _jiraDomain: JiraDomain;
    
        constructor(jiraLink: JiraLink, branchPattern: BranchPattern, jiraDomain: JiraDomain) {
            this._jiraLink = jiraLink;
            this._branchPattern = branchPattern;
            this._jiraDomain = jiraDomain;
    
            window.onDidChangeActiveTextEditor(this._jiraLink.update, this, this._subscriptions);

            this.registerCommand('extension.jiraBrowseLinkCommand', 
                () => this._jiraLink.browse());

            this.registerCommand('extension.setJiraBaseUrlCommand', 
                () => this._jiraDomain.showInputBox(() => this._jiraLink.update()));

            this.registerCommand('extension.setBranchPatternCommand', 
                () => this._branchPattern.showInputBox(() => this._jiraLink.update()));
        }
    
        public dispose() {
            Disposable.from(...this._subscriptions).dispose();
        }

        private registerCommand(command: string, callback: (...args: any[]) => any) {
            var disposible = commands.registerCommand(command, callback, this);
            this._subscriptions.push(disposible);
        }
    }