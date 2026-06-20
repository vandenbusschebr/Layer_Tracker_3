export async function fetchActivities() {
  const res = await fetch('/api/activities');
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function uploadImage(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)[1];
  const res = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType, fileName }),
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json(); // { url }
}

export async function fetchClothing() {
  const res = await fetch('/api/clothing');
  if (!res.ok) throw new Error('Failed to fetch clothing');
  return res.json();
}

export async function createClothingItem(item) {
  const res = await fetch('/api/clothing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to save clothing item');
  return res.json();
}

export async function updateClothingItem(id, item) {
  const res = await fetch(`/api/clothing/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to update clothing item');
  return res.json();
}

export async function deleteClothingItem(id) {
  const res = await fetch(`/api/clothing/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete clothing item');
  return res.json();
}

export async function updateActivityItem(id, activity) {
  const res = await fetch(`/api/activities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!res.ok) throw new Error('Failed to update activity');
  return res.json();
}

export async function deleteActivityItem(id) {
  const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete activity');
  return res.json();
}

export async function createActivity(activity) {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });
  if (!res.ok) throw new Error('Failed to save activity');
  return res.json();
}
