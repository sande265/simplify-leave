import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createConfig, deleteConfigs, getConfig, getConfigs, updateConfig } from "./config.controller";
import { validation } from "./config.validation";

const router: Router = Router();

router.post("/configs", authorize, createConfig);
router.patch("/configs/:id", authorize, updateConfig)
router.get("/configs", authorize, getConfigs);
router.get("/configs/:id", authorize, getConfig);
router.delete("/configs", authorize, deleteConfigs);

export {
    router as configsApi
}