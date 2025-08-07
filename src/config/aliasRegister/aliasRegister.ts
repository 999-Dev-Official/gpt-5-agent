import { addAlias } from "module-alias";
import * as path from "path";

const aliasRegister = {
  config: () => {
    // Get the root src directory (two levels up from this file)
    const rootPath = path.resolve(__dirname, "../..");

    addAlias("@", rootPath);
  },
};

export default aliasRegister;
