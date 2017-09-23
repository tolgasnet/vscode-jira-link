import { expect } from 'chai';
import * as sinon from 'sinon';
import { defaultBranchPattern } from '../src/default-branch-pattern';

describe("default branch pattern", () => {

    const testCases = [
        { branchName: 'feature/A-1', expectedStoryNumber: 'A-1' },
        { branchName: 'feature/B-1234', expectedStoryNumber: 'B-1234' },
        { branchName: 'feature/CDEF-5678', expectedStoryNumber: 'CDEF-5678' }
    ];

    it("should accept common patterns", () => {
        testCases.forEach(testCase => {
            verifyBranchPattern(testCase.branchName, testCase.expectedStoryNumber);
        });
    });
});

const verifyBranchPattern = (branchName, expectedStoryNumber) => {
    var match = defaultBranchPattern.exec(branchName);
    expect(match[1]).to.equal(expectedStoryNumber);
};
