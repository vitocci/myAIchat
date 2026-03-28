import { movieTool } from '../tools/movie-tool';

async function run() {
  try {
    if (!movieTool || typeof movieTool.execute !== 'function') {
      throw new Error('movieTool is not available');
    }

    // movieTool.execute options depend on the runtime tool wrapper; provide a single arg object
    // cast to any to avoid strict overload issues in this small test script
    const data = (await (movieTool as any).execute({ query: 'Inception', type: 'title' })) as any;

    console.log('Movie title:', data?.Title ?? 'N/A');
    console.log('Year:', data?.Year ?? 'N/A');
    console.log('imdbRating:', data?.imdbRating ?? 'N/A');
  } catch (e) {
    console.error('Error calling movieTool:', e);
    process.exit(1);
  }
}

run();
