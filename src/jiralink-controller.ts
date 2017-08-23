import { window, commands, Disposable } from 'vscode';
import { JiraLink } from './jiralink';

export class JiraLinkController {
    
        private _jiraLink: JiraLink;
        private _disposable: Disposable;
    
        constructor(jiraLink: JiraLink) {
            this._jiraLink = jiraLink;
            this._jiraLink.updateJiraLink();
    
            let subscriptions: Disposable[] = [];
            window.onDidChangeActiveTextEditor(this._onActiveEditorChangedEvent, this, subscriptions);
    
            var clickUrlCommand = commands.registerCommand('extension.jiraBrowseLinkCommand', this._onClickJiraLinkEvent, this);
    
            var setUrlCommand = commands.registerCommand('extension.setJiraBaseUrlCommand', this._onSetBaseUrl, this);
    
            var setBranchPatternCommand = commands.registerCommand('extension.setBranchPatternCommand', this._onSetBranchPattern, this);
    
            this._disposable = Disposable.from(...subscriptions, clickUrlCommand, setUrlCommand, setBranchPatternCommand);
        }
    
        private _onActiveEditorChangedEvent() {
            this._jiraLink.updateJiraLink();
        }
    
        private _onClickJiraLinkEvent() {
            this._jiraLink.openJiraLink();
        }
    
        private _onSetBaseUrl() {
            this._jiraLink.setBaseUrl();
        }
    
        private _onSetBranchPattern() {
            this._jiraLink.setBranchPattern();
        }
    
        public dispose() {
            this._disposable.dispose();
        }
    }