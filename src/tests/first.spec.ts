import { sequelize } from "../db/models";

beforeAll(() => {
  return sequelize.authenticate();
});

afterAll(() => {
  return sequelize.close();
});

describe("test", () => {
  it("sandbox", async () => {});
});
