import { devData } from "../data/dev-data";
import seed from "./seed";
import db from "../connection";

const runSeed = async () => {
  await seed(devData);
  await db.end();
};

runSeed();
