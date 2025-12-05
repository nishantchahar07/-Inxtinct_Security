import dotenv from 'dotenv';
import { connect } from './lib/db';

dotenv.config();

connect().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
