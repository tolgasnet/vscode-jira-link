import { window, commands, Disposable } from 'vscode';
import { JiraLink } from './jiralink';

export class JiraLinkController {
    
        private _jiraLink: JiraLink;
        private _subscriptions: Disposable[] = [];
    
        constructor(jiraLink: JiraLink) {
            this._jiraLink = jiraLink;
            this._jiraLink.updateJiraLink();
    
            window.onDidChangeActiveTextEditor(this._jiraLink.updateJiraLink, this, this._subscriptions);

            this.registerCommand('extension.jiraBrowseLinkCommand', () => this._jiraLink.openJiraLink());

            this.registerCommand('extension.setJiraBaseUrlCommand', () => this._jiraLink.setBaseUrl());

            this.registerCommand('extension.setBranchPatternCommand', () => this._jiraLink.setBranchPattern());
        }
    
        public dispose() {
            Disposable.from(...this._subscriptions).dispose();
        }

        private registerCommand(command: string, callback: (...args: any[]) => any) {
            var disposible = commands.registerCommand(command, callback, this);
            this._subscriptions.push(disposible);
        }
    }