import { seedIfEmpty } from '../db/seed';

describe('seedIfEmpty', () => {
  it('resolves without throwing', async () => {
    await expect(seedIfEmpty(1)).resolves.toBeUndefined();
  });
});
