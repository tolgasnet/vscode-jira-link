import { window } from 'vscode';
import * as stateManager from '../state-manager';

export function extractStoryNumber(branchName: string): string {
    var match = get().exec(branchName);
    while(match === null) {
        return "";
    }
    return match[1];
}

export function showInputBox(callback: Function) {
    var currentBranchPattern = get();

    window
        .showInputBox(
        {
            value: currentBranchPattern.source,
            prompt: "Enter your GIT branch pattern or set to empty to restore to default."
        })
        .then((value) => {
            if (typeof value == 'undefined') return;

            update(value)
            .then(
                (isSuccessful) => {
                    if (isSuccessful) {
                        var updatedValue = value.length > 0 ? 
                            `GIT branch pattern is updated as ${value}` : 
                            "GIT branch pattern is restored to default.";
                        window.showInformationMessage(`GIT branch pattern is updated as ${value}`);
                        callback();
                    }
                }
            );
        });
}

export function get(): RegExp {
    return stateManager.getBranchPattern();
}

function update(value): Thenable<void> {
    return stateManager.updateBranchPattern(value);
}