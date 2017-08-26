import { ExtensionContext } from 'vscode';
import { JiraLink } from './jira-link';
import registerEvents from './events';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export function activate(ctx: ExtensionContext) {

    let branchPattern = new BranchPattern(ctx);
    let jiraDomain = new JiraDomain(ctx);

    let jiraLink = new JiraLink(ctx, branchPattern, jiraDomain);
    jiraLink.initialize();

    var registeredEvents = registerEvents(jiraLink, branchPattern, jiraDomain);

    ctx.subscriptions.push(registeredEvents);
    ctx.subscriptions.push(jiraLink);
}