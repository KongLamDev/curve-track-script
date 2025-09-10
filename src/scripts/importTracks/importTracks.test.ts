import { expect } from "chai";
import sinon from "sinon";
import ExcelJS from "exceljs";

import { importTracks } from "./importTracks";
import { ContractModel, TrackModel } from "../../models";
import { invalidContractName, invalidRequiredFields } from "./helper";
import { mockWorkbook } from "../../test/mocks/mockWorkbook";
import {
  connectMongoose,
  disconnectMongoose,
  MongoDbTestEnvironment,
} from "../../test/helpers/mongoDbTestHelpers";

describe("importTracks function", function () {
  let mongoServer: MongoDbTestEnvironment;

  before(async () => {
    // Start in-memory MongoDB
    mongoServer = await connectMongoose();
    sinon.restore(); // Reset stubs
  });

  after(async () => {
    await disconnectMongoose(mongoServer);
  });

  it("should import valid rows and handle errors correctly", async () => {
    // Stub ExcelJS Workbook constructor
    sinon.stub(ExcelJS, "Workbook").callsFake(() => mockWorkbook as any);

    // Run importTracks
    const errors = await importTracks("mockWorkbook.xlsx");

    // ---- Assertions ----
    expect(errors).to.be.an("array");
    // Rows 1, 2 and 4 not created due to validation reasons
    expect(errors.length).to.equal(3);
    errors.forEach((error) => {
      expect(error).to.have.property("error");
      expect(error).to.have.property("lineNumber");
    });
    expect(errors[0].error).to.include(invalidRequiredFields);
    expect(errors[1].error).to.include(invalidRequiredFields);
    expect(errors[2].error).to.include(invalidContractName("Contract 2"));

    // Missing required Title field, not created
    const row1 = await TrackModel.findOne({ isrc: "ISRC1" });
    expect(row1).to.be.null;

    // Missing required ISRC field, not created
    const row2 = await TrackModel.findOne({ title: "Track 2" });
    expect(row2).to.be.null;

    // Track 1 created
    const row3 = await TrackModel.findOne({ title: "Track 3" });
    expect(row3).to.exist;
    expect(row3?.aliases).to.have.members(["aliases1", "aliases2"]);

    // Not created since contract name document doesn't exist
    const row4 = await TrackModel.findOne({ title: "Track 4" });
    expect(row4).to.be.null;

    // No contract name exists but save track without contract association
    // Ensure empty strings within the aliases array are filtered too
    const row5 = await TrackModel.findOne({ title: "Track 5" });
    expect(row5).to.exist;
    expect(row5?.aliases).to.have.members(["aliases111", "aliases222"]);

    // Contract 1 created
    const contract = await ContractModel.findOne({ name: "Contract 1" });
    expect(contract).to.exist;
  });
});
