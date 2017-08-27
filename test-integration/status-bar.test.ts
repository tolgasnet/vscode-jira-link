import * as vscode from 'vscode';
import { expect } from 'chai';
import * as stateManager from '../src/state-manager';
import * as statusBar from '../src/status-bar';
import * as jiraLink from '../src/jira-link';

suite("Statusbar link", () => {

    const extensionId = "tolgasofuoglu.jira-link";

    suiteSetup((done) => {
        stateManager.updateJiraDomain("mydomain")
        .then(() => {
            jiraLink.update();
            setTimeout(done, 1000);
        });
    });

    test("should be present", () => {
        expect(statusBar.statusBarItem).not.to.be.undefined; 
    });
});