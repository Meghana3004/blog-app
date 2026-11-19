import { getYear, parseISO, format } from 'date-fns';

export const generateArchiveData = (posts) => {
  const archive = {};
  posts.forEach(post => {
    const year = getYear(parseISO(post.date));
    const month = format(parseISO(post.date), 'MMMM');
    if (!archive[year]) {
      archive[year] = {};
    }
    if (!archive[year][month]) {
      archive[year][month] = [];
    }
    archive[year][month].push(post);
  });
  return archive;
};