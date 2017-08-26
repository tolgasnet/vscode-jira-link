import { ExtensionContext } from 'vscode';
import { JiraLink } from './jira-link';
import registerEvents from './events';
import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export function activate(context: ExtensionContext) {

    let state = context.workspaceState;
    let branchPattern = new BranchPattern(state);
    let jiraDomain = new JiraDomain(state);

    let jiraLink = new JiraLink(branchPattern, jiraDomain);
    jiraLink.initialize();

    var registeredEvents = registerEvents(jiraLink, branchPattern, jiraDomain);

    context.subscriptions.push(registeredEvents);
    context.subscriptions.push(jiraLink);
}