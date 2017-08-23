import { BranchPattern } from './config/branch-pattern';
import { JiraDomain } from './config/jira-domain';

export class UrlBuilder {

    private _branchPattern: BranchPattern;
    private _jiraDomain: JiraDomain;

    constructor(branchPattern: BranchPattern, jiraDomain: JiraDomain) {
        this._branchPattern = branchPattern;
        this._jiraDomain = jiraDomain;
    }

    public build(branchName: string) : string {
        let storyNumber = this._branchPattern.match(branchName);

        if (storyNumber.length === 0) {
            return "";
        }

        var jiraDomain = this._jiraDomain.get();
        
        return `${jiraDomain}/browse/${storyNumber}`;
    }
}