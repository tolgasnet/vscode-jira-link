import { StatusBarItem, StatusBarAlignment, window } from 'vscode';

export function show(jiraUrl: string, subscriptions) {
    let item = create();
    item.command = "jira-link.browse";
    item.text = `$(link-external) JIRA`;
    item.tooltip = jiraUrl;
    item.show();
    subscriptions.push(item);
}

export function error(branchName: string, storyNumber: string, subscriptions) {
    let item = create();
    item.command = null;
    item.text = `$(issue-opened) JIRA`;
    item.tooltip = `Error parsing branch <${branchName}> with the branch pattern: ${storyNumber}`;
    item.show();
    subscriptions.push(item);
}

const create = () => {
    return window.createStatusBarItem(StatusBarAlignment.Left);
};