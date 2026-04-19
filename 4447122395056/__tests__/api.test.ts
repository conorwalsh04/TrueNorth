import { fetchMotivationalQuote } from '../utils/api';

describe('fetchMotivationalQuote', () => {
  const originalKey = process.env.EXPO_PUBLIC_API_NINJAS_KEY;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_NINJAS_KEY = originalKey;
    jest.restoreAllMocks();
  });

  it('returns local fallback when API key is unset', async () => {
    delete process.env.EXPO_PUBLIC_API_NINJAS_KEY;
    const q = await fetchMotivationalQuote();
    expect(q.author).toBe('TrueNorth');
    expect(q.quote.length).toBeGreaterThan(0);
    expect(q.fetchError).toBeFalsy();
  });

  it('returns local fallback for placeholder key', async () => {
    process.env.EXPO_PUBLIC_API_NINJAS_KEY = 'your_api_ninjas_key_here';
    const q = await fetchMotivationalQuote();
    expect(q.author).toBe('TrueNorth');
    expect(q.fetchError).toBeFalsy();
  });

  it('returns remote quote when API responds with an array', async () => {
    process.env.EXPO_PUBLIC_API_NINJAS_KEY = 'test-key';
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ quote: 'Ship in harbor is safe.', author: 'Grace Hopper' }],
    } as Response);

    const q = await fetchMotivationalQuote();
    expect(q).toEqual({
      quote: 'Ship in harbor is safe.',
      author: 'Grace Hopper',
    });
    expect(q.fetchError).toBeFalsy();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.api-ninjas.com/v1/quotes?category=inspirational',
      expect.objectContaining({
        headers: { 'X-Api-Key': 'test-key' },
      }),
    );
  });

  it('falls back when response is not ok', async () => {
    process.env.EXPO_PUBLIC_API_NINJAS_KEY = 'test-key';
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => [],
    } as Response);

    const q = await fetchMotivationalQuote();
    expect(q.author).toBe('TrueNorth');
    expect(q.fetchError).toBe(true);
  });
});
