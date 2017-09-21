import { ExtensionContext, Disposable } from 'vscode';
import * as events from './events';
import * as jiraLink from './jira-link';
import * as stateManager from './state-manager';
import * as statusBar from './status-bar';

export function activate(context: ExtensionContext) {

    statusBar.initialize();

    stateManager.initialize(context);

    jiraLink.initialize();

    events.register(context);

    context.subscriptions.push(...stateManager.subscriptions);
}