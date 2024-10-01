export const buildCohereChatHistory = (messages: any[]) => {
  return messages.map(msg => {
    return {
      message: msg.content,
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
    };
  });
};

export const buildCohereMessage = (messages: any[]) => {
  const userMessage = messages.find(msg => msg.role === 'user');
  return userMessage ? userMessage.content : null;
};

export const buildCohereTools = (tools) => {
  return tools?.map(tool => {
    const functionDef = tool.function;

    if (!functionDef?.parameters) {
      return null;
    }

    return {
      description: functionDef.description,
      name: functionDef.name.replace(/-/g, '_'),
      parameter_definitions: Object.entries(functionDef.parameters.properties ?? {}).reduce((acc, [key, value]) => {
        const paramValue = value as { description: string; type: string };
        acc[key] = {
          description: paramValue.description,
          required: functionDef.parameters?.required?.includes(key) ?? false,
          type: paramValue.type,
        };
        return acc;
      }, {} as Record<string, { description: string; required: boolean; type: string }>),
    };
  }) ?? [];
};
