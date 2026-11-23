import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseISO, format } from 'date-fns';
import { convertCommentFromJSONToHTML } from '../utils/convertCommentFromJSONToHTML';

export const usePrevNextPosts = (postId) => {
  const [prevPostId, setPrevPostId] = useState(null);
  const [nextPostId, setNextPostId] = useState(null);
  const [disableButtons, setDisableButtons] = useState({
    prevDisabled: false,
    nextDisabled: false,
  });

  useEffect(() => {
    const fetchPrevNextPosts = async () => {
      try {
        if (postId) {
          const response = await axios.get(`/posts/${postId}/prevnext`);
          const { prevPostId, nextPostId } = response.data;
          setPrevPostId(prevPostId);
          setNextPostId(nextPostId);
          setDisableButtons({
            prevDisabled: !prevPostId,
            nextDisabled: !nextPostId,
          });
        }
      } catch (err) {
        console.error('Error fetching previous and next post IDs:', err);
      }
    };

    fetchPrevNextPosts();
  }, [postId]);

  return { prevPostId, nextPostId, disableButtons };
};

export const useFormattedPostData = (post) => {
  let formattedDate = '';
  let formattedText = '';
  let postTime = '';

  if (post && post.date) {
    const parsedDate = parseISO(post.date);
    formattedDate = format(parsedDate, "EEEE dd MMMM yyyy");
    formattedText = convertCommentFromJSONToHTML(post.content);
    postTime = format(parsedDate, "HH:mm");
  }

  return { formattedDate, formattedText, postTime };
};

const hooks = { usePrevNextPosts, useFormattedPostData};
export default hooks;