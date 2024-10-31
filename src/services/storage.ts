import fs from 'fs';
import path from 'path';

const DATA_DIR = './data';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

export class FileStorage {
  private filename: string;
  private filepath: string;

  constructor(storeName: string) {
    this.filename = `${storeName}.json`;
    this.filepath = path.join(DATA_DIR, this.filename);
  }

  save<T>(data: T): void {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving data to ${this.filename}:`, error);
      throw error;
    }
  }

  load<T>(defaultValue: T): T {
    try {
      if (!fs.existsSync(this.filepath)) {
        this.save(defaultValue);
        return defaultValue;
      }
      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading data from ${this.filename}:`, error);
      return defaultValue;
    }
  }
}