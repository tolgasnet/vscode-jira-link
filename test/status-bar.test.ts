import { expect } from 'chai';
import * as sinon from 'sinon';
import * as stateManager from '../src/state-manager';
import * as statusBar from '../src/status-bar';
import * as vscode from '../src/vscode-wrapper';

describe("status bar", () => {

    beforeEach(() => {
        stubWrapper();
    });

    afterEach(() => {
        (vscode.createStatusBarItem as any).restore();
        (vscode.leftAlign as any).restore();
    });

    describe("on initialize", () => {

        it("should create new status bar item on initialize", () => {
            
            expect(statusBar.statusBarItem).to.be.undefined;
    
            statusBar.initialize();
    
            expect(statusBar.statusBarItem).not.to.be.undefined;
        });
    
        it("should add the statusBarItem to subscriptions, on initialize", () => {

            stubSubscriptions();

            expect(fakeSubscriptions.length).to.equal(0);
    
            statusBar.initialize();
    
            expect(fakeSubscriptions.length).to.equal(1);
        });
    });

    describe("after initialize", () => {

        beforeEach(() => {
            statusBar.initialize();
        });

        it("should show status bar", () => {
            const expectedUrl = "anyUrl";
            
            statusBar.show(expectedUrl);
            
            const item = statusBar.statusBarItem;
            expect(item.command).to.equal("jira-link.browse");
            expect(item.text).to.equal(`$(link-external) JIRA`);
            expect(item.tooltip).to.equal(expectedUrl);
        });

        it("should show status barin error state", () => {
            const branchName = "anyName";
            const branchPattern = "anyPattern";
            
            statusBar.error(branchName, branchPattern);
            
            const item = statusBar.statusBarItem;
            expect(item.command).to.equal("jira-link.browse");
            expect(item.text).to.equal(`$(issue-opened) JIRA`);
            expect(item.tooltip).to.equal(`Error parsing branch <${branchName}> with the branch pattern: ${branchPattern}`);
        });
    });

    const fakeSubscriptions = [];
    const stubSubscriptions = () => {
        sinon
            .stub(stateManager.subscriptions, "push")
            .callsFake(item => fakeSubscriptions.push(item));
    }

    const stubWrapper = () => {
        sinon.stub(vscode, "createStatusBarItem").returns({ show: () => {}});
        sinon.stub(vscode, "leftAlign").returns(0);
    }
});