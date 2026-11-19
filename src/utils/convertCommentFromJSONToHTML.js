import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

export const convertCommentFromJSONToHTML = (text) => {
  return stateToHTML(convertFromRaw(JSON.parse(text)));
};