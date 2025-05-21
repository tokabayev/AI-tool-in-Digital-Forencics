const API_URL = 'http://127.0.0.1:8000';

export const registerUser = async (username, password, email) => {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email })
  });
  return response;
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password })
  });
  if (response.ok) {
    localStorage.setItem('loginTime', Date.now());
  }
  return response;
};

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/audio/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return response;
};

export const analyzeFile = async (fileId, token) => {
  const response = await fetch(`${API_URL}/audio/analyze/${fileId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

export const getUserHistory = async (token) => {
  const response = await fetch(`${API_URL}/user/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const loginTime = localStorage.getItem('loginTime');
  if (!token || !loginTime) return false;
  const timeElapsed = Date.now() - parseInt(loginTime);
  const sessionTime = 30
  const sessionInTime = sessionTime * 60 * 1000;
  return timeElapsed < sessionInTime;
};

export const getUserFiles = async (token) => {
  const response = await fetch(`${API_URL}/user/files`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const downloadUserFile = async (fileId, token) => {
  const response = await fetch(`${API_URL}/user/files/download/${fileId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download file: ${errorText}`);
  }
  return await response.blob();
};

export const downloadReport = async (requestId, token) => {
  const response = await fetch(`${API_URL}/user/history/report/${requestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download report: ${errorText}`);
  }
  return await response.blob();
};

export const downloadJsonReport = async (requestId, token) => {
  const response = await fetch(`${API_URL}/user/history/json/${requestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка при загрузке JSON отчёта: ${errorText}`);
  }
  
  return await response.blob();
};