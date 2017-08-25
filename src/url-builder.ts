import { BranchPattern } from '../src/config/branch-pattern';
import { JiraDomain } from '../src/config/jira-domain';

export class UrlBuilder {

    private _branchPattern: BranchPattern;
    private _jiraDomain: JiraDomain;

    constructor(branchPattern: BranchPattern, jiraDomain: JiraDomain) {
        this._branchPattern = branchPattern;
        this._jiraDomain = jiraDomain;
    }

    public build(branchName: string) : string {
        const storyNumber = this._branchPattern.extractStoryNumber(branchName);

        if (storyNumber.length === 0) {
            return "";
        }

        const jiraDomain = this._jiraDomain.get();
        
        return `${jiraDomain}/browse/${storyNumber}`;
    }
}