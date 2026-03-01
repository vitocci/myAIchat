import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const currencyTool = createTool({
  id: 'get-brl-exchange-rate',
  description:
    'Get the exchange rate from a foreign currency to BRL (Brazilian real)',
  inputSchema: z.object({
    from: z
      .string()
      .length(3)
      .describe(
        'Currency code to convert from, like USD, EUR, GBP, ARS, JPY',
      ),
    amount: z
      .number()
      .positive()
      .default(1)
      .describe('Amount in source currency. Default is 1.'),
  }),
  outputSchema: z.object({
    from: z.string(),
    to: z.literal('BRL'),
    amount: z.number(),
    rate: z.number(),
    convertedAmount: z.number(),
    date: z.string(),
  }),
  execute: async ({ from, amount }) => {
    const source = from.toUpperCase();
    const url = `https://api.frankfurter.app/latest?from=${source}&to=BRL&amount=${amount}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate for ${source} -> BRL`);
    }

    const data = (await response.json()) as FrankfurterResponse;
    const brlRate = data.rates.BRL;

    if (typeof brlRate !== 'number') {
      throw new Error(`Currency ${source} is not supported by the provider`);
    }

    return {
      from: source,
      to: 'BRL' as const,
      amount,
      rate: brlRate / amount,
      convertedAmount: brlRate,
      date: data.date,
    };
  },
});
