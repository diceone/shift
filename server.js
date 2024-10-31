import express from 'express';
import { FileStorage } from './src/services/storage.js';
import ViteExpress from 'vite-express';

const app = express();
app.use(express.json());

// Storage endpoints
app.get('/api/storage/:key', (req, res) => {
  const storage = new FileStorage(req.params.key);
  try {
    const data = storage.load({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.post('/api/storage/:key', (req, res) => {
  const storage = new FileStorage(req.params.key);
  try {
    storage.save(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start server
const port = process.env.PORT || 3000;
ViteExpress.listen(app, port, () => {
  console.log(`Server running on port ${port}`);
});