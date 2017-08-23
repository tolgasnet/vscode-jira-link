import { ExtensionContext, window } from 'vscode';

export class BranchPattern {

    private _branchPatternStorageKey: string = "branch-pattern";
    private _ctx: ExtensionContext;

    constructor(ctx: ExtensionContext) {
        this._ctx = ctx;
    }

    public match(branchName: string): string {
        var match = this.get().exec(branchName);
        while(match === null) {
            return "";
        }
        return match[1];
    }

    public get(): RegExp {
        var branchPattern = this._ctx.workspaceState.get<string>(this._branchPatternStorageKey, "");
        return branchPattern.length > 0 ? new RegExp(branchPattern, "i") : /feature\/([a-zA-Z]{3}\-?[0-9]{3})/i;    
    }

    public set(callback: Function) {
        var branchPattern = this.get();

        window
            .showInputBox(
            {
                value: branchPattern.source,
                prompt: "Enter your GIT branch pattern or set to empty to restore to default."
            })
            .then((value) => {
                if (typeof value == 'undefined') return;

                this._ctx.workspaceState
                    .update(this._branchPatternStorageKey, value)
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
}