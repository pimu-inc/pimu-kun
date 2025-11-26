import { DiscordHono } from 'discord-hono';
import { handlers } from './commands';

const app = new DiscordHono()
  .command('omikuzi', (context) => handlers.omikuzi({ context }))
  .command('time', async (context) => await handlers.time({ context }))
  .command('nazo', async (context) => await handlers.nazo({ context }));

export default app;
