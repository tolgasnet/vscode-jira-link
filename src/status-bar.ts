import { StatusBarItem, StatusBarAlignment } from 'vscode';
import * as vs from './vscode-wrapper';
import * as stateManager from './state-manager';

export let statusBarItem: StatusBarItem;

export const initialize = () => {
    statusBarItem = vs.createStatusBarItem(vs.leftAlign());
    stateManager.subscriptions.push(statusBarItem);
};

export const show = (jiraUrl: string) => {
    statusBarItem.command = "jira-link.browse";
    statusBarItem.text = `$(link-external) JIRA`;
    statusBarItem.tooltip = jiraUrl;
    statusBarItem.show();
}

export const error = (branchName: string, branchPattern: string) => {
    statusBarItem.command = "jira-link.browse";
    statusBarItem.text = `$(issue-opened) JIRA`;
    statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${branchPattern}`;
    statusBarItem.show();
}