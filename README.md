# Curve Track Import Script

A Node.js script for importing track data from Excel files into MongoDB using Mongoose. Written in **TypeScript** and fully tested with **Mocha**, **Chai**, and **MongoMemoryServer**.

---

## Features

- Parse Excel `.xlsx` files using [ExcelJS](https://www.npmjs.com/package/exceljs)
- Map spreadsheet columns to MongoDB document fields
- Validate rows and report errors without stopping the import
- Automatically create a default contract (`Contract 1`)
- Supports aliases as semi-colon separated values
- Fully tested with in-memory MongoDB

---

## Requirements

- Node.js >= 20
- MongoDB (for running against a real database)
- Npm for dependency management

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd curve-track-script
```

2. Install dependencies

```npm install

```

3. Create a `.env` file in the root folder:

```MONGO_URI=mongodb://127.0.0.1:27017/curve-track-db

```

Replace the URI with your MongoDB connection string.

4. Run the script

```
npm run importTracks
```

## Testing

```
npm test
```
