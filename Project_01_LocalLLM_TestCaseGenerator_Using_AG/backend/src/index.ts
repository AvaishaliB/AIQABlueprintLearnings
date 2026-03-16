import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import { testConnection, generateTestCases } from './controllers/llmController';

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req: Request, res: Response) => res.json({ status: 'ok' }));
app.post('/api/test-connection', testConnection);
app.post('/api/generate', generateTestCases);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
