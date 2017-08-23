import { ExtensionContext } from 'vscode';
import { JiraLink } from './jiralink';
import { Events } from './events';

export function activate(ctx: ExtensionContext) {

    let jiraLink = new JiraLink(ctx);
    jiraLink.updateJiraLink();

    let events = new Events(jiraLink);

    ctx.subscriptions.push(events);
    ctx.subscriptions.push(jiraLink);
}