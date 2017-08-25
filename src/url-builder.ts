export class UrlBuilder {

    private _branchPattern;
    private _jiraDomain;

    constructor(branchPattern, jiraDomain) {
        this._branchPattern = branchPattern;
        this._jiraDomain = jiraDomain;
    }

    public build(branchName: string) : string {
        let storyNumber = this._branchPattern.extractStoryNumber(branchName);

        if (storyNumber.length === 0) {
            return "";
        }

        var jiraDomain = this._jiraDomain.get();
        
        return `${jiraDomain}/browse/${storyNumber}`;
    }
}