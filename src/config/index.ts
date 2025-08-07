import dotenv from "dotenv";
import aliasRegister from "./aliasRegister";

dotenv.config();
aliasRegister.config();

export const config = {
  port: process.env.PORT || 7102,
  openmartApiKey: process.env.OPENMART_API_KEY || "",
};

export * from "./agentChat";
