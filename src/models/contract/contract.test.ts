import { expect } from "chai";

import { ContractModel } from "../";
import {
  connectMongoose,
  disconnectMongoose,
  MongoDbTestEnvironment,
} from "../../test/helpers/mongoDbTestHelpers";

describe("Contract Model", () => {
  let mongoServer: MongoDbTestEnvironment;

  before(async () => {
    mongoServer = await connectMongoose();
  });

  after(async () => {
    await disconnectMongoose(mongoServer);
  });

  it("should create a contract", async () => {
    const contract = await ContractModel.create({
      name: "Test unique contract name",
    });
    expect(contract.name).to.equal("Test unique contract name");
  });

  it("should not allow duplicate contract names", async () => {
    let err: any;
    try {
      await ContractModel.create({ name: "Test unique contract name" });
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
  });
});
