import devData from "../data/test-data";
import seed from "./seed";
import db from "../connection";

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
