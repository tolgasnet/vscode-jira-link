import { Memento, window } from 'vscode';

    const _jiraUriStorageKey: string = "jira-uri";

    export function initialize(state: Memento, update: Function) {
        var jiraDomain = get(state);
        if (jiraDomain.length === 0) {
            showInputBox(state, () => update());
            return;
        }

        update();
    }

    export function showInputBox(state: Memento, callback: Function) {
        var jiraBaseUri = get(state);
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

                state
                    .update(_jiraUriStorageKey, value)
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

    export function get(state: Memento): string {
        return state.get<string>(_jiraUriStorageKey, "");
    }
