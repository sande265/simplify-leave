import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createAccount, deleteAccounts, getAccount, getAccounts, updateAccount } from "./account.controller";

const router: Router = Router();

router.post("/accounts", authorize, createAccount);
router.patch("/accounts/:id", authorize, updateAccount)
router.get("/accounts", authorize, getAccounts);
router.get("/accounts/:id", authorize, getAccount);
router.delete("/accounts", authorize, deleteAccounts);

export {
    router as accountsApi
}