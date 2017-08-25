import { expect } from 'chai';
import { UrlBuilder } from '../../src/url-builder';
import { BranchPattern } from '../../src/config/branch-pattern';
import { JiraDomain } from '../../src/config/jira-domain';

describe("Url builder tests", () => {

    const anyBranchName: string = "any-branch-name";

    it("given story number is empty string, returns empty url", () => {

        let branchPattern = { extractStoryNumber: () => { return ""; }};
        let urlBuilder = new UrlBuilder(<any>branchPattern, null);
        let url = urlBuilder.build(anyBranchName);

        expect(url).to.equal("");
    });

    it("builds url", () => {
        
        let branchPattern = { extractStoryNumber: () => { return "123"; }};
        let jiraDomain = { get: () => { return "domain"; }};

        let urlBuilder = new UrlBuilder(<any>branchPattern, <any>jiraDomain);
        let url = urlBuilder.build(anyBranchName);

        expect(url).to.equal("domain/browse/123");
    });
});