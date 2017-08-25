import * as TypeMoq from "typemoq";
import { expect } from 'chai';
import { UrlBuilder } from '../../src/url-builder';
import { BranchPattern } from '../../src/config/branch-pattern';

describe("Url builder tests", () => {

    it("given story number is empty string, returns empty url", () => {
        
        const mockBranchPattern: TypeMoq.IMock<BranchPattern> = TypeMoq.Mock.ofType<BranchPattern>();
        mockBranchPattern.setup(x => x.match(TypeMoq.It.isAny())).returns(() => "");
        let urlBuilder = new UrlBuilder(mockBranchPattern.object, null);
        let url = urlBuilder.build("");

        expect(url).to.equal("");
    });

    it("builds url", () => {
        
        let branchPattern = { match: () => { return "123"; } };
        let jiraDomain = { get: () => { return "domain"; } };

        let urlBuilder = new UrlBuilder(<any>branchPattern, <any>jiraDomain);
        let url = urlBuilder.build("");

        expect(url).to.equal("domain/browse/123");
    });
});