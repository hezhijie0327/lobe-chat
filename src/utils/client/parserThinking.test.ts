import { describe, it, expect } from 'vitest';
import { parseThinkingMessages } from './parserThinking';

describe('parseThinkingMessages', () => {
  it('should remove thinking tags from assistant string content', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>Let me think about this...</think>Here is my response.'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('Here is my response.');
  });

  it('should remove multiple thinking tags from assistant string content', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>First thought</think>Response part 1<think>Second thought</think>Response part 2'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('Response part 1Response part 2');
  });

  it('should remove thinking tags with multiline content', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>\nThis is a multiline\nthinking process\nwith newlines\n</think>Final answer here.'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('Final answer here.');
  });

  it('should remove thinking tags from assistant array content', () => {
    const messages = [
      {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '<think>Processing...</think>Here is the text response.'
          },
          {
            type: 'image', 
            url: 'https://example.com/image.jpg'
          }
        ]
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content[0].text).toBe('Here is the text response.');
    expect(result[0].content[1]).toEqual({
      type: 'image',
      url: 'https://example.com/image.jpg'
    });
  });

  it('should not modify user messages', () => {
    const messages = [
      {
        role: 'user',
        content: '<think>This should not be removed</think>User message content.'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('<think>This should not be removed</think>User message content.');
  });

  it('should not modify system messages', () => {
    const messages = [
      {
        role: 'system',
        content: '<think>System thinking</think>System prompt here.'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('<think>System thinking</think>System prompt here.');
  });

  it('should handle messages without content', () => {
    const messages = [
      {
        role: 'assistant'
      },
      {
        role: 'assistant',
        content: null
      },
      {
        role: 'assistant',
        content: undefined
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ role: 'assistant' });
    expect(result[1]).toEqual({ role: 'assistant', content: null });
    expect(result[2]).toEqual({ role: 'assistant', content: undefined });
  });

  it('should handle empty thinking tags', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think></think>Response without thinking content.'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('Response without thinking content.');
  });

  it('should handle content with only thinking tags', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>Only thinking content here</think>'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('');
  });

  it('should preserve other HTML-like tags', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>Remove this</think><div>Keep this</div><span>And this</span>'
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content).toBe('<div>Keep this</div><span>And this</span>');
  });

  it('should handle nested thinking tags correctly', () => {
    const messages = [
      {
        role: 'assistant',
        content: '<think>Outer thinking</think><think>Another thinking</think>Final response.'
      }
    ];

    const result = parseThinkingMessages(messages);

    // 由于使用非贪婪匹配，每个 think 标签会被单独移除
    expect(result[0].content).toBe('Final response.');
  });

  it('should handle mixed content types in array', () => {
    const messages = [
      {
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: '<think>First thinking</think>First text'
          },
          {
            type: 'code',
            language: 'javascript',
            code: 'console.log("hello");'
          },
          {
            type: 'text',
            text: '<think>Second thinking</think>Second text'
          }
        ]
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0].content[0].text).toBe('First text');
    expect(result[0].content[1]).toEqual({
      type: 'code',
      language: 'javascript', 
      code: 'console.log("hello");'
    });
    expect(result[0].content[2].text).toBe('Second text');
  });

  it('should preserve message structure and other properties', () => {
    const messages = [
      {
        id: 'msg-123',
        role: 'assistant',
        content: '<think>Remove this</think>Keep this response.',
        timestamp: 1234567890,
        metadata: { model: 'glm-z1-flash' }
      }
    ];

    const result = parseThinkingMessages(messages);

    expect(result[0]).toEqual({
      id: 'msg-123',
      role: 'assistant',
      content: 'Keep this response.',
      timestamp: 1234567890,
      metadata: { model: 'glm-z1-flash' }
    });
  });
});
