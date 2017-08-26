import * as vscode from 'vscode';
//import * as assert from 'assert';
import { expect } from 'chai';
import * as myExtension from '../src/extension';

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
});