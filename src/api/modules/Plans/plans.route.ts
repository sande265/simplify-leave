import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createPlan, deletePlans, getPlan, getPlans, updatePlan } from "./plans.controller";

const router: Router = Router();

router.post("/plans", authorize, createPlan);
router.patch("/plans/:id", authorize, updatePlan)
router.get("/plans", authorize, getPlans);
router.get("/plans/:id", authorize, getPlan);
router.delete("/plans", authorize, deletePlans);

export {
    router as plansApi
}