import mongoose from "mongoose";
import path from "path";
import { importTracks } from "./importTracks";

const filePath = path.resolve(__dirname, "../../assets/Track Import Test.xlsx");

importTracks(filePath)
  .then((errors) => {
    if (errors.length) {
      console.error("Import completed with errors", errors);
    } else {
      console.log("Import completed with no errors");
    }
  })
  .catch((err) => {
    console.error("Import failed, exiting process:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    console.log("Disconnecting from MongoDB");
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.error("Error during MongoDB disconnect:", err);
    }
  });
