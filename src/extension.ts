import { ExtensionContext } from 'vscode';
import { JiraLink } from './jiralink';
import { Events } from './events';
import { BranchPattern } from './config/branch-pattern';

export function activate(ctx: ExtensionContext) {

    let branchPattern = new BranchPattern(ctx);

    let jiraLink = new JiraLink(ctx, branchPattern);
    jiraLink.updateJiraLink();

    let events = new Events(jiraLink, branchPattern);

    ctx.subscriptions.push(events);
    ctx.subscriptions.push(jiraLink);
}