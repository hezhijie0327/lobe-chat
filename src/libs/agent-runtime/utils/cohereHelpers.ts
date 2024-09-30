export const buildCohereChatHistory = (messages) => {
  return messages.map(msg => {
    return {
      message: msg.content,
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
    };
  });
};

export const buildCohereMessage = (messages) => {
  const userMessage = messages.find(msg => msg.role === 'user');
  return userMessage ? userMessage.content : null;
};
