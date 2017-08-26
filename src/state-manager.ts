import { ExtensionContext, Memento, Disposable } from 'vscode';

let state: Memento;
const _jiraUriStorageKey: string = "jira-uri";
const _branchPatternStorageKey: string = "branch-pattern";

export let subscriptions: { dispose(): any }[] = [];

export function initialize(context: ExtensionContext) {
    state = context.workspaceState;
}

export function getJiraDomain(): string {
    return state.get<string>(_jiraUriStorageKey, "");
}

export function updateJiraDomain(value): Thenable<void> {
    return state.update(_jiraUriStorageKey, value);
}

export function getBranchPattern(): RegExp {
    var branchPattern = state.get<string>(_branchPatternStorageKey, "");
    return branchPattern.length > 0 ? new RegExp(branchPattern, "i") : /feature\/([a-zA-Z]{1,4}\-?[0-9]{1,4})/i;    
}

export function updateBranchPattern(value): Thenable<void> {
    return state.update(_branchPatternStorageKey, value);
}