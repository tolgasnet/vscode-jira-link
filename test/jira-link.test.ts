import { expect } from 'chai';
import * as sinon from 'sinon';
import * as jiraLink from '../src/jira-link';
import * as jiraDomain from '../src/config/jira-domain';
import * as git from '../src/git';
import * as vscode from '../src/vscode-wrapper';

describe("jira-link", () => {
    it("should initialize the jira domain configuration", () => {
        const spyCallback = sinon.spy();
        const stubJiraDomain = sinon.stub(jiraDomain, "initialize").callsArg(0);
        const stubGit = sinon.stub(git, "getCurrentBranch");
        const stubWorkspacePath = sinon.stub(vscode, "workspaceRootPath");

        jiraLink.initialize();

        expect(stubJiraDomain.calledOnce).to.equal(true);
        expect(stubGit.calledOnce).to.equal(true);
        expect(stubWorkspacePath.calledOnce).to.equal(true);
    });
});