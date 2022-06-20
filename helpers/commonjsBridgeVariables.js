import { fileURLToPath } from 'url';
import path from 'path';

const __filename = (__import) => fileURLToPath(__import.url);
const __dirname = (__import) => path.dirname(__filename(__import));

export { __dirname, __filename };
