import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import DOMPurify from 'dompurify';

export const convertCommentFromJSONToHTML = (text) => {
  const html = stateToHTML(convertFromRaw(JSON.parse(text)));
  return DOMPurify.sanitize(html);
};