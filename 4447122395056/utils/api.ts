const FALLBACK = {
  quote: 'Every day is a chance to be better.',
  author: 'TrueNorth',
};

type NinjasQuote = {
  quote?: string;
  author?: string;
};

/**
 * Fetches an inspirational quote from API Ninjas when `EXPO_PUBLIC_API_NINJAS_KEY` is set.
 * Falls back to a local quote on missing key, network errors, or invalid responses.
 */
export async function fetchMotivationalQuote(): Promise<{ quote: string; author: string }> {
  const key = process.env.EXPO_PUBLIC_API_NINJAS_KEY;
  if (!key || key === 'your_api_ninjas_key_here') {
    return FALLBACK;
  }

  try {
    const res = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
      headers: { 'X-Api-Key': key },
    });
    if (!res.ok) {
      return FALLBACK;
    }
    const data = (await res.json()) as NinjasQuote | NinjasQuote[];
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.quote && typeof row.quote === 'string') {
      return {
        quote: row.quote,
        author: typeof row.author === 'string' && row.author.length > 0 ? row.author : 'Unknown',
      };
    }
  } catch {
    /* use fallback */
  }

  return FALLBACK;
}
