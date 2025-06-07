const thinkingTagRegex = /<think>[\S\s]*?<\/think>/g;

/**
 * 移除文本中的 <think></think> 标签及其内容
 * @param text 包含 thinking 标签的字符串
 * @returns 移除标签后的文本
 */
const removeThinkingTags = (text: string): string => {
  return text.replace(thinkingTagRegex, '').trim();
};

/**
 * 解析消息内容，从 assistant 角色的消息中移除 <think></think> 标签及其内容
 * @param messages 原始消息数组
 * @returns 处理后的消息数组
 */
export const removeThinkingTagsMessages = (messages: any[]): any[] =>
  messages.map(message => {
    // 只处理 assistant 角色的消息
    if (message?.role !== 'assistant' || !message?.content) return message;

    const { content } = message;

    // 字符串类型直接处理
    if (typeof content === 'string') {
      return { 
        ...message, 
        content: removeThinkingTags(content)
      };
    }

    // 数组类型处理其中的 text 元素
    if (Array.isArray(content)) {
      return {
        ...message,
        content: content.map(item => 
          item?.type === 'text' 
            ? { 
                ...item, 
                text: removeThinkingTags(item.text)
              }
            : item
        )
      };
    }

    return message;
  });
