import * as vscode from 'vscode';
import { expect } from 'chai';
import * as stateManager from '../src/state-manager';

suite("Extension", () => {

    const extensionId = "tolgasofuoglu.jira-link";

    test("should be present", () => {
        let extension = vscode.extensions.getExtension(extensionId);
        expect(extension).to.not.be.undefined;
    });

    test("should be active", () => {
        let extension = vscode.extensions.getExtension(extensionId);
        expect(extension.isActive).to.be.true;
    });

    test("should have the commands registered", () => {
        return vscode.commands.getCommands(true).then((commands) => {
            const expectedCommands = [
                "jira-link.browse",
                "jira-link.setJiraDomain",
                "jira-link.setBranchPattern"
            ];

            const actualCommands = commands.filter((value) => {
                return expectedCommands.indexOf(value) >= 0 || value.startsWith("jira-link.");
            });

            let listOfActualCommands = actualCommands.join(",");
            const errorMsg = `Got: ${listOfActualCommands}`;
            expect(actualCommands.length, errorMsg).to.equal(expectedCommands.length);
        });
    });

    test("should have the disposables subscribed", () => {
        expect(stateManager.subscriptions).to.have.lengthOf(5);
    });

    test("should have the default jira domain set to empty string", () => {
        expect(stateManager.getJiraDomain()).to.equal("");
    });

    test("should have the default branch pattern set to empty string", () => {
        expect(stateManager.getBranchPattern().source).to.equal("feature\\/([a-zA-Z]{1,4}\\-?[0-9]{1,4})");
    });
});