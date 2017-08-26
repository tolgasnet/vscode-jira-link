import { window } from 'vscode';
import * as stateManager from '../state-manager';

export function initialize(update: Function) {
    var jiraDomain = get();
    if (jiraDomain.length === 0) {
        showInputBox(() => update());
        return;
    }

    update();
}

export function showInputBox(callback: Function) {
    var jiraBaseUri = get();
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

            update(value)
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

export function get(): string {
    return stateManager.getJiraDomain();
}

function update(value): Thenable<void> {
    return stateManager.updateJiraDomain(value);
}