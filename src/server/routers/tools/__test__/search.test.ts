// @vitest-environment node
import { TRPCError } from '@trpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toolsEnv } from '@/config/tools';
import { SearXNGClient } from '@/server/modules/SearXNG';
import { SEARCH_SEARXNG_NOT_CONFIG } from '@/types/tool/search';

import { searchRouter } from '../search';

// Mock JWT verification
vi.mock('@/utils/server/jwt', () => ({
  getJWTPayload: vi.fn().mockResolvedValue({ userId: '1' }),
}));

vi.mock('@lobechat/web-crawler', () => ({
  Crawler: vi.fn().mockImplementation(() => ({
    crawl: vi.fn().mockResolvedValue({ content: 'test content' }),
  })),
}));

vi.mock('@/server/modules/SearXNG');

describe('searchRouter', () => {
  const mockContext = {
    req: {
      headers: {
        authorization: 'Bearer mock-token',
      },
    },
    authorizationHeader: 'Bearer mock-token',
    jwtPayload: { userId: '1' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    toolsEnv.SEARXNG_URL = 'http://test-searxng.com';
  });

  describe('crawlPages', () => {
    it('should crawl multiple pages successfully', async () => {
      const caller = searchRouter.createCaller(mockContext as any);

      const result = await caller.crawlPages({
        urls: ['http://test1.com', 'http://test2.com'],
        impls: ['naive'],
      });

      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ content: 'test content' });
      expect(result.results[1]).toEqual({ content: 'test content' });
    });

    it('should work without specifying impls', async () => {
      const caller = searchRouter.createCaller(mockContext as any);

      const result = await caller.crawlPages({
        urls: ['http://test.com'],
      });

      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toEqual({ content: 'test content' });
    });
  });

  describe('query', () => {
    it('should throw error if SEARXNG_URL is not configured', async () => {
      // @ts-ignore
      toolsEnv.SEARXNG_URL = undefined;

      const caller = searchRouter.createCaller(mockContext as any);

      await expect(
        caller.query({
          query: 'test query',
        }),
      ).rejects.toThrow(
        new TRPCError({ code: 'NOT_IMPLEMENTED', message: SEARCH_SEARXNG_NOT_CONFIG }),
      );
    });

    it('should return search results successfully', async () => {
      const mockSearchResult = {
        results: [
          {
            title: 'Test Result',
            url: 'http://test.com',
            content: 'Test content',
          },
        ],
      };

      (SearXNGClient as any).mockImplementation(() => ({
        search: vi.fn().mockResolvedValue(mockSearchResult),
      }));

      const caller = searchRouter.createCaller(mockContext as any);

      const result = await caller.query({
        query: 'test query',
        optionalParams: {
          searchEngines: ['google'],
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should work without specifying search engines', async () => {
      const mockSearchResult = {
        results: [
          {
            title: 'Test Result',
            url: 'http://test.com',
            content: 'Test content',
          },
        ],
      };

      (SearXNGClient as any).mockImplementation(() => ({
        search: vi.fn().mockResolvedValue(mockSearchResult),
      }));

      const caller = searchRouter.createCaller(mockContext as any);

      const result = await caller.query({
        query: 'test query',
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should handle search errors', async () => {
      (SearXNGClient as any).mockImplementation(() => ({
        search: vi.fn().mockRejectedValue(new Error('Search failed')),
      }));

      const caller = searchRouter.createCaller(mockContext as any);

      await expect(
        caller.query({
          query: 'test query',
        }),
      ).rejects.toThrow(new TRPCError({ code: 'SERVICE_UNAVAILABLE', message: 'Search failed' }));
    });
  });
});
