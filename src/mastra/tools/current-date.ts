import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const currentDateTool = createTool({
  id: 'get-current-date',
  description: 'Get current date',
  inputSchema: z.object({
    tz: z
      .string()
      .optional()
      .describe('IANA timezone, ex: "America/Sao_Paulo". Se omitido, usa o timezone do sistema.'),
    format: z
      .enum(['iso', 'locale', 'timestamp'])
      .default('iso')
      .describe('Formato de saída: "iso" (padrão), "locale" ou "timestamp".'),
  }),
  outputSchema: z.object({
    date: z.string(),
    iso: z.string(),
    timestamp: z.number(),
    timezone: z.string(),
  }),
  execute: async ({ tz, format }) => {
    const now = new Date();

    let timezone = tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
    let iso: string;

    try {
      // 'sv' locale yields "YYYY-MM-DD HH:mm:ss" which we convert to a T-separated string
      const sv = now.toLocaleString('sv', { timeZone: timezone });
      iso = sv.replace(' ', 'T');
    } catch (e) {
      // fallback to UTC ISO if the provided timezone is invalid
      timezone = 'UTC';
      iso = now.toISOString();
    }

    const locale = now.toLocaleString(undefined, { timeZone: timezone });
    const timestamp = now.getTime();

    const date = format === 'locale' ? locale : format === 'timestamp' ? String(timestamp) : iso;

    return { date, iso, timestamp, timezone };
  },
});
