import { window, commands, Disposable } from 'vscode';
import { JiraLink } from './jira-link';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export default function registerCommands(jiraLink, branchPattern, jiraDomain) {
    
    const updateEvent = window.onDidChangeActiveTextEditor(jiraLink.update);

    const browseCmd = register('jira-link.browse',
        () => jiraLink.browse());

    const jiraDomainCmd = register('jira-link.setJiraDomain',
        () => jiraDomain.showInputBox(() => jiraLink.update()));

    const branchPatternCmd = register('jira-link.setBranchPattern', 
        () => branchPattern.showInputBox(() => jiraLink.update()));

    return Disposable.from(
        updateEvent,
        browseCmd,
        jiraDomainCmd,
        branchPatternCmd);
}

const register = (command, callback) => {
    return commands.registerCommand(command, callback);
};