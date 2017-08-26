import { ExtensionContext } from 'vscode';
import registerEvents from './events';
import * as jiraLink from './jira-link';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';

export function activate(context: ExtensionContext) {

    jiraLink.initialize(context);

    var registeredEvents = registerEvents(context);

    context.subscriptions.push(registeredEvents);
}