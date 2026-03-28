import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Movie tool using OMDb API.
 * The API key provided by the user is embedded here for local usage.
 * NOTE: keep this key private when sharing public repos.
 */
export const movieTool = createTool({
  id: 'get-movie',
  description: 'Fetch movie details from OMDb (title or IMDb id)',
  inputSchema: z.object({
    query: z.string().describe('Movie title or IMDb id (e.g. tt3896198)'),
    year: z.string().describe('Release year of the movie (optional)').optional(),
    type: z
      .enum(['title', 'imdb'])
      .default('title')
      .describe('If "imdb" the query is treated as an IMDb id (i=), otherwise as a title (t=)'),
  }),
  outputSchema: z.any(),
  execute: async ({ query, type, year }) => {
    // API key provided by the user
    const apiKey = '5b8912c4';

    const base = 'http://www.omdbapi.com/';
    let url =
      type === 'imdb'
        ? `${base}?i=${encodeURIComponent(query)}&apikey=${apiKey}`
        : `${base}?t=${encodeURIComponent(query)}&apikey=${apiKey}`;
    if (year) {
      url += `&y=${encodeURIComponent(year)}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OMDb request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    // Return the raw OMDb response for flexibility; agents can pick fields they need.
    return data;
  },
});
