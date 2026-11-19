import React from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const RichTextEditor = ({ data }) => {
    console.log(data);
    const blocks = data.blocks;
    blocks.forEach(blocks => {
        console.log(`Block text: ${blocks.text}`);
      });
  if (!data.blocks) {
    return data;
  }

  const contentState = ContentState.createFromText(data.blocks[0].text);
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarHidden
        readOnly
        blockRendererFn={(block) => {
          const inlineStyles = block.getInlineStyleAt(0)
            .toArray()
            .map((style) => style.toLowerCase());

          const blockStyle = {
            fontStyle: inlineStyles.includes('italic') ? 'italic' : 'normal',
            fontWeight: inlineStyles.includes('bold') ? 'bold' : 'normal',
          };

          return <div style={blockStyle}>{block.getText()}</div>;
        }}
      />
    </div>
  );
};

export default RichTextEditor;