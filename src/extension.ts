import { ExtensionContext } from 'vscode';
import registerEvents from './events';
import * as jiraLink from './jira-link';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';
import * as stateManager from './state-manager';

export function activate(context: ExtensionContext) {

    stateManager.initialize(context);

    jiraLink.initialize(context);

    var registeredEvents = registerEvents(context);

    context.subscriptions.push(registeredEvents);
}