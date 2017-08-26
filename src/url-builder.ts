export default function urlBuilder(getStoryNumber, getJiraDomain) {

    const storyNumber = getStoryNumber();
    
    if (storyNumber.length === 0) {
        return "";
    }

    return `${getJiraDomain()}/browse/${storyNumber}`;
}