import { expect } from 'chai';
import urlBuilder from '../../src/url-builder';

describe("Url builder tests", () => {

    it("given story number is empty string, returns empty url", () => {

        const getStoryNumber = () => "";
        
        const url = urlBuilder(() => getStoryNumber(), null);

        expect(url).to.equal("");
    });

    it("given a story number and jira domain, builds url", () => {
        
        const getStoryNumber = () => "123";
        const getJiraDomain = () => "domain";
        
        const url = urlBuilder(() => getStoryNumber(), () => getJiraDomain());

        expect(url).to.equal("domain/browse/123");
    });
});