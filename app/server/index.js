import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getActivities, appendActivity, updateActivity, deleteActivity, getClothing, appendClothing, updateClothing, deleteClothing } from './sheets.js';
import { uploadImage } from './cloudinary.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/activities', async (req, res) => {
  try {
    const activities = await getActivities();
    res.json(activities);
  } catch (err) {
    console.error('GET /api/activities error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/activities/:id', async (req, res) => {
  try { res.json(await updateActivity(req.params.id, req.body)); }
  catch (err) { console.error('PUT /api/activities error:', err.message); res.status(500).json({ error: err.message }); }
});

app.delete('/api/activities/:id', async (req, res) => {
  try { await deleteActivity(req.params.id); res.json({ ok: true }); }
  catch (err) { console.error('DELETE /api/activities error:', err.message); res.status(500).json({ error: err.message }); }
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await appendActivity(req.body);
    res.json(activity);
  } catch (err) {
    console.error('POST /api/activities error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload-image', async (req, res) => {
  try {
    const { base64, mimeType, fileName } = req.body;
    const url = await uploadImage(base64, mimeType, fileName);
    res.json({ url });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).end();
    const buffer = await response.arrayBuffer();
    res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clothing', async (req, res) => {
  try { res.json(await getClothing()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/clothing', async (req, res) => {
  try { res.json(await appendClothing(req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/clothing/:id', async (req, res) => {
  try { res.json(await updateClothing(req.params.id, req.body)); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/clothing/:id', async (req, res) => {
  try { await deleteClothing(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
