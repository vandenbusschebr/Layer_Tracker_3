import { google } from 'googleapis';
import 'dotenv/config';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = 'Sheet1!A:K';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function rowToActivity(row) {
  const [id, date, type, typeEmoji, location, feel, temp, wind, skies, baseLayers, outerwear] = row;
  return {
    id: Number(id),
    date,
    type,
    typeEmoji,
    location,
    feel,
    weather: { temp, wind, skies },
    baseLayers: JSON.parse(baseLayers || '[]'),
    outerwear: JSON.parse(outerwear || '[]'),
  };
}

export async function getActivities() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
  const [_header, ...rows] = res.data.values ?? [];
  return rows.filter(r => r[0]).map(rowToActivity);
}

const CLOTHING_RANGE = 'Clothing!A:D';

function rowToClothingItem(row) {
  const [id, category, name, imageUrl] = row;
  return { id, category, name, imageUrl: imageUrl || '' };
}

export async function getClothing() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: CLOTHING_RANGE });
  const [_header, ...rows] = res.data.values ?? [];
  return rows.filter(r => r[0]).map(rowToClothingItem);
}

export async function appendClothing(item) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const existing = await getClothing();
  const id = Date.now().toString();
  const row = [id, item.category, item.name, item.imageUrl || ''];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: CLOTHING_RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
  return { id, ...item };
}

export async function updateClothing(id, item) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: CLOTHING_RANGE });
  const rows = res.data.values ?? [];
  // rows[0] is header, data starts at index 1
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) throw new Error(`Clothing item ${id} not found`);
  const sheetRow = rowIndex + 1; // 1-based
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Clothing!A${sheetRow}:D${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[id, item.category, item.name, item.imageUrl || '']] },
  });
  return { id, ...item };
}

export async function deleteClothing(id) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: CLOTHING_RANGE });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) throw new Error(`Clothing item ${id} not found`);
  const sheetRow = rowIndex + 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Clothing!A${sheetRow}:D${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['', '', '', '']] },
  });
}

export async function updateActivity(id, activity) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
  if (rowIndex === -1) throw new Error(`Activity ${id} not found`);
  const sheetRow = rowIndex + 1;
  const { date, type, typeEmoji, location, feel, weather, baseLayers, outerwear } = activity;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Sheet1!A${sheetRow}:K${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[id, date, type, typeEmoji, location, feel, weather.temp, weather.wind, weather.skies, JSON.stringify(baseLayers), JSON.stringify(outerwear)]] },
  });
  return { ...activity, id };
}

export async function deleteActivity(id) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && String(r[0]) === String(id));
  if (rowIndex === -1) throw new Error(`Activity ${id} not found`);
  const sheetRow = rowIndex + 1;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Sheet1!A${sheetRow}:K${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['', '', '', '', '', '', '', '', '', '', '']] },
  });
}

export async function appendActivity(activity) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() });

  // Get current rows to determine next id
  const existing = await getActivities();
  const nextId = existing.length ? Math.max(...existing.map(a => a.id)) + 1 : 1;

  const { date, type, typeEmoji, location, feel, weather, baseLayers, outerwear } = activity;
  const row = [
    nextId,
    date,
    type,
    typeEmoji,
    location,
    feel,
    weather.temp,
    weather.wind,
    weather.skies,
    JSON.stringify(baseLayers),
    JSON.stringify(outerwear),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });

  return { ...activity, id: nextId };
}
