import { Router } from "express";
import { postEventsController } from "@/controllers/events";

const router: Router = Router();

router.post("/", postEventsController);

export default router;
