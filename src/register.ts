import { register } from 'discord-hono';
import { omikuziBuilder } from './commands/omikuzi/builder';
import { timeBuilder } from './commands/time/builder';

const commands = [timeBuilder, omikuziBuilder];

register(commands, process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_TOKEN);
