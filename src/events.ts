import { window, commands, Disposable, ExtensionContext } from 'vscode';
import * as jiraLink from './jira-link';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';
import * as stateManager from './state-manager';

export function register(context: ExtensionContext) {

    const update = () => jiraLink.update(context);
    const updateEvent = window.onDidChangeActiveTextEditor(update, null, stateManager.subscriptions);

    const browseCmd = registerCommand('jira-link.browse',
        () => jiraLink.browse());

    const jiraDomainCmd = registerCommand('jira-link.setJiraDomain',
        () => jiraDomain.showInputBox(update));

    const branchPatternCmd = registerCommand('jira-link.setBranchPattern', 
        () => branchPattern.showInputBox(update));
}

const update = (context) => {
    jiraLink.update(context);
};

const registerCommand = (command, callback) => {
    let disposible = commands.registerCommand(command, callback);
    stateManager.subscriptions.push(disposible);
};