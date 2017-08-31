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
            // todo
        });
    });

    const fakeSubscriptions = [];
    const stubSubscriptions = () => {
        sinon
            .stub(stateManager.subscriptions, "push")
            .callsFake(item => fakeSubscriptions.push(item));
    }

    const stubWrapper = () => {
        sinon.stub(vscode, "createStatusBarItem").returns({});
        sinon.stub(vscode, "leftAlign").returns(0);
    }
});