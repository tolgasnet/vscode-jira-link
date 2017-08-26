import { Memento, window } from 'vscode';

export class JiraDomain {

    private _jiraUriStorageKey: string = "jira-uri";
    private _state: Memento;

    constructor(state: Memento) {
        this._state = state;
    }

    public initialize(update: Function) {
        var jiraDomain = this.get();
        if (jiraDomain.length === 0) {
            this.showInputBox(() => update());
            return;
        }

        update();
    }

    public showInputBox(callback: Function) {
        var jiraBaseUri = this.get();
        var defaultUri = jiraBaseUri && jiraBaseUri.length > 0 ? jiraBaseUri : "https://mydomain.atlassian.net";
        var domainFragmentEndIndex = defaultUri.indexOf(".");

        window
            .showInputBox(
            {
                value: defaultUri,
                valueSelection: [8, domainFragmentEndIndex],
                prompt: "Enter your JIRA host base url"
            })
            .then((value) => {
                if (typeof value == 'undefined') return;

                this._state
                    .update(this._jiraUriStorageKey, value)
                    .then(
                        (isSuccessful) => {
                            if (isSuccessful) {
                                window.showInformationMessage(`JIRA base url is updated as ${value}`);
                                callback();
                            }
                        }
                    );
            });
    }

    public get(): string {
        return this._state.get<string>(this._jiraUriStorageKey, "");
    }
}