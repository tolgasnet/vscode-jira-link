import { StatusBarItem, StatusBarAlignment, window } from 'vscode';
import * as stateManager from './state-manager';

export let statusBarItem: StatusBarItem;

export const initialize = () => {
    statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    stateManager.subscriptions.push(statusBarItem);
};

export function show(jiraUrl: string) {
    statusBarItem.command = "jira-link.browse";
    statusBarItem.text = `$(link-external) JIRA`;
    statusBarItem.tooltip = jiraUrl;
    statusBarItem.show();
}

export function error(branchName: string, branchPattern: string) {
    statusBarItem.command = "jira-link.browse";
    statusBarItem.text = `$(issue-opened) JIRA`;
    statusBarItem.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${branchPattern}`;
    statusBarItem.show();
}