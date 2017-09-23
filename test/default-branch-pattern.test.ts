import { expect } from 'chai';
import * as sinon from 'sinon';
import { defaultBranchPattern } from '../src/default-branch-pattern';

describe("default branch pattern", () => {

    const testCases = [
        { branchName: 'feature/A-1', expectedStoryNumber: 'A-1' },
        { branchName: 'feature/B-1234', expectedStoryNumber: 'B-1234' },
        { branchName: 'feature/CDEF-5678', expectedStoryNumber: 'CDEF-5678' },
        { branchName: 'tech/A-1', expectedStoryNumber: 'A-1' },
        { branchName: 'hotfix/KLM-1234', expectedStoryNumber: 'KLM-1234' }
    ];

    it("should accept common patterns", () => {
        testCases.forEach(testCase => {
            verifyBranchPattern(testCase.branchName, testCase.expectedStoryNumber);
        });
    });
});

const verifyBranchPattern = (branchName, expectedStoryNumber) => {
    var match = defaultBranchPattern.exec(branchName);
    expect(match, `${branchName} could not be parsed. expected ${expectedStoryNumber}`).not.to.be.null;
    expect(match[1]).to.equal(expectedStoryNumber);
};
