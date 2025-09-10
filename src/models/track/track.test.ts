import mongoose from "mongoose";
import { expect } from "chai";

import { TrackModel } from "./track.model";
import { ContractModel } from "../contract/contract.model";
import {
  connectMongoose,
  disconnectMongoose,
  MongoDbTestEnvironment,
} from "../../test/helpers/mongoDbTestHelpers";

describe("Track Model", () => {
  let mongoServer: MongoDbTestEnvironment;
  let contractId: mongoose.Types.ObjectId;

  before(async () => {
    mongoServer = await connectMongoose();

    // Create a default contract
    const contract = await ContractModel.create({ name: "Contract 1" });
    contractId = contract._id;
  });

  after(async () => {
    await disconnectMongoose(mongoServer);
  });

  it("should create a track with all fields", async () => {
    const track = await TrackModel.create({
      title: "Track 1",
      version: "Original",
      artist: "Artist 1",
      isrc: "ISRC001",
      p_line: "P 2025",
      aliases: ["T1", "Track One"],
      contract_id: contractId,
    });

    expect(track.title).to.equal("Track 1");
    expect(track.version).to.equal("Original");
    expect(track.artist).to.equal("Artist 1");
    expect(track.isrc).to.equal("ISRC001");
    expect(track.p_line).to.equal("P 2025");
    expect(track.aliases).to.have.members(["T1", "Track One"]);
    expect(track.contract_id?.toString()).to.equal(contractId.toString());
  });

  it("should create a track with only required fields", async () => {
    const track = await TrackModel.create({
      title: "Track 2",
      isrc: "ISRC002",
    });

    expect(track.title).to.equal("Track 2");
    expect(track.isrc).to.equal("ISRC002");
  });

  it("should fail if required fields are missing", async () => {
    let err: any;
    try {
      await TrackModel.create({}); // Missing required fields title and ISRC
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
    expect(err.errors.title).to.exist;
    expect(err.errors.isrc).to.exist;
  });

  it("should allow multiple aliases", async () => {
    const track = await TrackModel.create({
      title: "Track 3",
      isrc: "ISRC003",
      aliases: ["Alias1", "Alias2", "Alias3"],
    });
    expect(track.aliases).to.have.length(3);
  });
});
