import { expect } from 'chai';
import * as proxyquire from 'proxyquire';

describe("git", () => {
    it("should set the project directory", () => {
        
        const directory = "anyDirectory";
        const expectedBranchName = "1";
    
        let callback = () => {};
        let execStub: any = (cmd, options, execDone) => {
            expect(options.cwd).to.equal(directory);
        };

        git(execStub).getCurrentBranch(directory, () => {});
    });

    it("get the branch name back", () => {
        
        const expectedBranchName = "myBranch";
    
        let callback = (branchName) => {};
        let execStub: any = (cmd, options, execDone) => {
            execDone("", expectedBranchName,"");
        };

        git(execStub).getCurrentBranch("", (branchName) => {
            expect(branchName).to.equal(expectedBranchName);
        });
    });

    const git = (execStub) => {
        return proxyquire('../src/git', { 'child_process': { exec: execStub} });
    }
});