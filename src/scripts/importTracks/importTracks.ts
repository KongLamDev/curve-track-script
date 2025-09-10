import mongoose from "mongoose";
import ExcelJS from "exceljs";
import dotenv from "dotenv";

import { ErrorRow, ParsedRow } from "./types";
import { validateRow } from "./helper";

import { ContractModel, TrackModel } from "../../models";

dotenv.config();

export const importTracks = async (filePath: string): Promise<ErrorRow[]> => {
  const errors: ErrorRow[] = [];

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log(`Connected to MongoDB on port: ${process.env.MONGO_URI}`);
    }

    // Create Contract 1 if it doesn't exist
    const existing = await ContractModel.findOne({ name: "Contract 1" });
    if (!existing) {
      await ContractModel.create({ name: "Contract 1" });
      console.log("Created unique contract name called: Contract 1");
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    // Get keys from the first row
    const headerRow = sheet.getRow(1);

    // ExcelJS includes a null/empty first element in .values
    const headers: string[] = (
      (Array.isArray(headerRow.values) && headerRow.values.slice(1)) as string[]
    ).map((header) => header?.toString().trim() || "");

    const data: ParsedRow[] = [];

    // Loop through the rest of the rows and create key value pairs as an array of objects
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowData: Partial<ParsedRow> = {};

      headers.forEach((header, colIndex) => {
        const key = header
          .toLowerCase()
          .replace(/\s+/g, "_") as keyof ParsedRow;
        const value = row.getCell(colIndex + 1).value as string;
        (rowData as any)[key] = value;
      });

      rowData.lineNumber = rowNumber;

      data.push(rowData as ParsedRow);
    });

    // Validate through each track, creating a new document for each track if no errors while storing errors into an array
    for (const track of data) {
      const result = await validateRow(track);
      if (result.error) {
        errors.push(result.error);
      } else if (result.data) {
        const trackCreated = await TrackModel.create(result.data);
        console.log("trackCreated", trackCreated);
      }
    }
    return errors;
  } catch (err) {
    throw err;
  }
};
