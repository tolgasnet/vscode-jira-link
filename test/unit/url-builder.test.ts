import * as TypeMoq from "typemoq";
import { expect } from 'chai';
import { UrlBuilder } from '../../src/url-builder';
import { BranchPattern } from '../../src/config/branch-pattern';
import { JiraDomain } from '../../src/config/jira-domain';

describe("Url builder tests", () => {

    const anyBranchName: string = "any-branch-name";
    const mockBranchPattern: TypeMoq.IMock<BranchPattern> = TypeMoq.Mock.ofType<BranchPattern>();
    const jiraDomain: TypeMoq.IMock<JiraDomain> = TypeMoq.Mock.ofType<JiraDomain>();
    const urlBuilder = new UrlBuilder(mockBranchPattern.object, jiraDomain.object);

    it("given story number is empty string, returns empty url", () => {

        mockBranchPattern.setup(x => x.extractStoryNumber(anyBranchName)).returns(() => "");
        
        let url = urlBuilder.build(anyBranchName);

        expect(url).to.equal("");
    });

    it("builds url", () => {
        
        mockBranchPattern.setup(x => x.extractStoryNumber(anyBranchName)).returns(() => "123");
        jiraDomain.setup(x => x.get()).returns(() => "domain");

        let url = urlBuilder.build(anyBranchName);

        expect(url).to.equal("domain/browse/123");
    });
});