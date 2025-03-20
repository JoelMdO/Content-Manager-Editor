import { AppDispatch } from "@/services/store"
export const createArticleID = (dispatch: AppDispatch, isArticleCreated: string) => {
    //
    if (!isArticleCreated || isArticleCreated === '') {
    // Create an article ID .
    console.log('Create an article ID on page load.');
    const date = new Date();
    const day = date.getDate(); // Day of the month (1-31)
    const month = date.getMonth() + 1; // Month (0-11, so adding 1)
    const year = date.getFullYear(); 
    dispatch({ type: 'data_state/createID', payload: `article-${day}-${month}-${year}`});
    return `article-${day}-${month}-${year}`;
    }
}