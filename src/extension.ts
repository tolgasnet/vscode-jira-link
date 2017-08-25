import { ExtensionContext } from 'vscode';
import { JiraLink } from './jira-link';
import { Events } from './events';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export function activate(ctx: ExtensionContext) {

    let branchPattern = new BranchPattern(ctx);
    let jiraDomain = new JiraDomain(ctx);

    let jiraLink = new JiraLink(ctx, branchPattern, jiraDomain);
    jiraLink.initialize();

    let events = new Events(jiraLink, branchPattern, jiraDomain);

    ctx.subscriptions.push(events);
    ctx.subscriptions.push(jiraLink);
}