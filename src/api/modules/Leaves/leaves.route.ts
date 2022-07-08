import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createLeave, getLeaves } from "./leaves.controller";

const router: Router = Router();

router.post("/leaves", authorize, createLeave);
// router.patch("/users/:id", authorize, updateUser)
router.get("/leaves", authorize, getLeaves);
// router.get("/users/:id", authorize, getUser);
// router.delete("/users", authorize, deleteUsers);

export {
    router as leavesApi
}