import { ExtensionContext, Memento, StatusBarAlignment, window, workspace } from 'vscode';
import getCurrentBranch from './git';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';
import * as statusBar from './status-bar';
import urlBuilder from './url-builder';
var opn = require('opn');

export function initialize(context: ExtensionContext) {
    jiraDomain.initialize(context.workspaceState, () => update(context));
}

export function update(context) {
    getCurrentBranch(
        workspace.rootPath,
        (branchName) => updateStatusBar(context, branchName)
    );
}

export let browse;

const updateStatusBar = (context, branchName) => {
    let url = urlBuilder(
        () => branchPattern.extractStoryNumber(context.workspaceState, branchName), 
        () => jiraDomain.get(context.workspaceState));
    
    if (url.length === 0) {
        const storyNumber = branchPattern.get(context.workspaceState).source;
        statusBar.error(branchName, storyNumber, context.subscriptions);
        return;
    }

    browse = () => opn(url);
    statusBar.show(url, context.subscriptions);
};