import { ExtensionContext, workspace } from 'vscode';
import getCurrentBranch from './git';
import * as branchPattern from './config/branch-pattern';
import * as jiraDomain from './config/jira-domain';
import * as statusBar from './status-bar';
import urlBuilder from './url-builder';
var opn = require('opn');

export function initialize(context: ExtensionContext) {
    jiraDomain.initialize(() => update(context));
}

export function update(context) {
    getCurrentBranch(
        workspace.rootPath,
        (branchName) => updateStatusBar(context, branchName)
    );
}

export let browse;

const updateStatusBar = (context, branchName) => {

    const jiraDomainUrl = () => jiraDomain.get();

    let url = urlBuilder(
        () => branchPattern.extractStoryNumber(branchName), 
        () => jiraDomainUrl());
    
    if (url.length === 0) {
        const storyNumber = branchPattern.get().source;
        statusBar.error(branchName, storyNumber);
        browse = () => opn(jiraDomainUrl());
        return;
    }

    browse = () => opn(url);
    statusBar.show(url);
};