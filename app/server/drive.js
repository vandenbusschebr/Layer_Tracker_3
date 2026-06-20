import { google } from 'googleapis';
import { Readable } from 'stream';
import 'dotenv/config';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
    ],
  });
}

export async function uploadImageToDrive(base64Data, mimeType, fileName) {
  const drive = google.drive({ version: 'v3', auth: getAuth() });

  // Convert base64 to buffer then to stream
  const buffer = Buffer.from(base64Data, 'base64');
  const stream = Readable.from(buffer);

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType,
      parents: FOLDER_ID ? [FOLDER_ID] : undefined,
    },
    media: { mimeType, body: stream },
    fields: 'id',
  });

  const fileId = file.data.id;

  // Make publicly readable
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
}
