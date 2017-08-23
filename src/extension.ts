import { ExtensionContext } from 'vscode';
import { JiraLink } from './jiralink';
import { JiraLinkController } from './jiralink-controller';

export function activate(ctx: ExtensionContext) {

    let jiraLink = new JiraLink(ctx);
    let controller = new JiraLinkController(jiraLink);

    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(jiraLink);
}