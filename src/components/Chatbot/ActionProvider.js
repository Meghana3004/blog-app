import React from 'react';
import axios from 'axios';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleQuestion = async (question) => {
    setState((previous) => ({
      ...previous,
      messages: [...previous.messages, createChatBotMessage('Searching the blog posts...')],
    }));

    try {
      const response = await axios.post('/assistant/ask', { query: question });
      const sources = response.data.sources || [];
      const sourceText = sources.length
        ? `\n\nSources: ${sources.map((source) => source.title).join('; ')}`
        : '';
      setState((previous) => ({
        ...previous,
        messages: [...previous.messages, createChatBotMessage(`${response.data.answer}${sourceText}`)],
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'The assistant could not answer right now.';
      setState((previous) => ({
        ...previous,
        messages: [...previous.messages, createChatBotMessage(message)],
      }));
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => React.cloneElement(child, {
        actions: { handleQuestion },
      }))}
    </div>
  );
};

export default ActionProvider;
