import { window, commands, Disposable, ExtensionContext } from 'vscode';
import * as jiraLink from './jira-link';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';

export default function registerCommands(context: ExtensionContext) {

    const update = () => jiraLink.update(context);
    const updateEvent = window.onDidChangeActiveTextEditor(update);

    const browseCmd = register('jira-link.browse',
        () => jiraLink.browse());

    const jiraDomainCmd = register('jira-link.setJiraDomain',
        () => jiraDomain.showInputBox(context.workspaceState, update));

    const branchPatternCmd = register('jira-link.setBranchPattern', 
        () => branchPattern.showInputBox(context.workspaceState, update));

    return Disposable.from(
        updateEvent,
        browseCmd,
        jiraDomainCmd,
        branchPatternCmd);
}

const update = (context) => {
    jiraLink.update(context);
};

const register = (command, callback) => {
    return commands.registerCommand(command, callback);
};