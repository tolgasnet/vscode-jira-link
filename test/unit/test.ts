import * as assert from 'assert';
import * as sinon from 'sinon';
import { UrlBuilder } from '../../src/urlBuilder';

describe("Url builder tests", () => {

    it("given story number is empty string, returns empty url", () => {
        
        let branchPattern = { match: () => { return ""; } };
        let urlBuilder = new UrlBuilder(<any>branchPattern, null);
        let url = urlBuilder.build("");

        assert.equal(url, "");
    });

    it("builds url", () => {
        
        let branchPattern = { match: () => { return "123"; } };
        let jiraDomain = { get: () => { return "domain"; } };

        let urlBuilder = new UrlBuilder(<any>branchPattern, <any>jiraDomain);
        let url = urlBuilder.build("");

        assert.equal(url, "domain/browse/123");
    });
});