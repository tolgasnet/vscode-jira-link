import { expect } from 'chai';
import * as sinon from 'sinon';
import * as git from '../src/git';
var proc = require('child_process');

describe("git", () => {

    afterEach(() => {
        proc.exec.restore();
    });

    it("should set the project directory", () => {
        
        const directory = "anyDirectory";
        const expectedBranchName = "1";

        fakeExec((cmd, options, execDone) => {
            expect(options.cwd).to.equal(directory);
        });

        git.getCurrentBranch(directory, () => {});
    });

    it("get the branch name back", () => {
        
        const expectedBranchName = "myBranch";
    
        fakeExec((cmd, options, execDone) => {
            execDone("", expectedBranchName,"");
        });

        git.getCurrentBranch("", (branchName) => {
            expect(branchName).to.equal(expectedBranchName);
        });
    });

    const fakeExec = (fake) => {
        sinon.stub(proc, "exec").callsFake(fake);
    }
});