import { convertCommentFromJSONToHTML } from './convertCommentFromJSONToHTML';

test('removes unsafe URL protocols from rich-text links', () => {
  const content = {
    blocks: [{
      key: 'link1',
      text: 'click',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{ offset: 0, length: 5, key: 0 }],
      data: {},
    }],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { url: 'javascript:alert(1)' },
      },
    },
  };

  expect(convertCommentFromJSONToHTML(JSON.stringify(content))).not.toMatch(/javascript:/i);
});
