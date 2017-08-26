import { Memento, window } from 'vscode';

const _branchPatternStorageKey: string = "branch-pattern";

export function extractStoryNumber(state: Memento, branchName: string): string {
    var match = get(state).exec(branchName);
    while(match === null) {
        return "";
    }
    return match[1];
}

export function get(state: Memento): RegExp {
    var branchPattern = state.get<string>(_branchPatternStorageKey, "");
    return branchPattern.length > 0 ? new RegExp(branchPattern, "i") : /feature\/([a-zA-Z]{1,4}\-?[0-9]{1,4})/i;    
}

export function showInputBox(state: Memento, callback: Function) {
    var currentBranchPattern = get(state);

    window
        .showInputBox(
        {
            value: currentBranchPattern.source,
            prompt: "Enter your GIT branch pattern or set to empty to restore to default."
        })
        .then((value) => {
            if (typeof value == 'undefined') return;

            state
                .update(_branchPatternStorageKey, value)
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
