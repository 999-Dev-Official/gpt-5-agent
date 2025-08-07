import { config } from "./config";

import express from "express";
import { eventsRouter } from "./routes";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Add routes
expressApp.use("/v1/events", eventsRouter);

// Start the Express server
expressApp.listen(config.port, () => {
  console.log(`⚡️ Server is running on port ${config.port}`);
});
