import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import { config } from '../config.js';
let queue = Promise.resolve();
export async function readDatabase() {
  try { return JSON.parse(await readFile(config.databasePath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { players: {} }; throw error; }
}
export function updateDatabase(mutator) {
  const task = queue.then(async () => {
    const data = await readDatabase();
    const result = await mutator(data);
    await mkdir(dirname(config.databasePath), { recursive: true });
    const temp = `${config.databasePath}.tmp`;
    await writeFile(temp, JSON.stringify(data, null, 2));
    await rename(temp, config.databasePath);
    return result;
  });
  queue = task.catch(() => {});
  return task;
}
