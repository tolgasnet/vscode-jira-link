//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as vscode from 'vscode';
import * as assert from 'assert';
import * as myExtension from '../src/extension';

suite("Extension", () => {

    const extensionId = "tolgasofuoglu.jira-link";

    test("should be present", () => {
        assert.ok(vscode.extensions.getExtension(extensionId));
    });

    test("should be active", () => {
        assert.ok(vscode.extensions.getExtension(extensionId).isActive);
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
            assert.equal(actualCommands.length, expectedCommands.length, errorMsg);
        });
    });
});