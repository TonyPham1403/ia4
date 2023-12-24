// db.js

const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db.json');

const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    const rows = data.split('\n');
    return rows.map(row => {
      const [email, username, password] = row.split(',');
      return { email, username, password };
    });
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

const writeDatabase = (data) => {
  const rows = data.map(({ email, username, password }) => `${email},${username},${password}`);
  const content = rows.join('\n');
  fs.writeFileSync(dbFilePath, content, 'utf8');
};

const db = {
  add: (email, username, password) => {
    const data = readDatabase();
    data.push({ email, username, password });
    writeDatabase(data);
  },
  get: (field, value) => {
    const data = readDatabase();
    return data.find(entry => entry[field] === value);
  },
  getAll: () => {
    return readDatabase();
  },
  update: (field, value, updateData) => {
    const data = readDatabase();
    const index = data.findIndex(entry => entry[field] === value);
    if (index !== -1) {
      data[index] = { ...data[index], ...updateData };
      writeDatabase(data);
      return true;
    }
    return false;
  },
};

module.exports = db;
