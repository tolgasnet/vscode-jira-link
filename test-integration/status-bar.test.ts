import * as vscode from 'vscode';
import { expect } from 'chai';
import * as stateManager from '../src/state-manager';
import * as statusBar from '../src/status-bar';
import * as jiraLink from '../src/jira-link';
import * as git from '../src/git';

suite("Statusbar link", () => {

    const extensionId = "tolgasofuoglu.jira-link";

    suiteSetup((done) => {
        stateManager.updateJiraDomain("mydomain")
        .then(() => {
            jiraLink.update();
            setTimeout(done, 1000);
        });
    });

    test("should be initialized", () => {
        expect(statusBar.statusBarItem).not.to.be.undefined;
    });

    test("should have browse command set", () => {
        expect(statusBar.statusBarItem.command).to.equal("jira-link.browse"); 
    });

    test("should have the link text in failed state", () => {
        const errorMsg = statusBar.statusBarItem.tooltip;
        expect(statusBar.statusBarItem.text, errorMsg).to.equal(`$(issue-opened) JIRA`); 
    });

    // In order to test the success state:
    // 1) have a version controlled proj folder inside test-integration folder
    // 2) as part of the test, initialize git and create a feature branch
    // 3) load the workspace from that folder
    // 4) test, teardown (delete git folder)
    test("should have the link text in failed state", () => {
    });
});