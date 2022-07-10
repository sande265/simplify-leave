import { Router } from "express";
import { authorize } from "../../../middlewares/auth.middleware";
import { createTransaction, getTransactions, getUserTransactions } from "./transactions.controller";

const router: Router = Router();

router.post("/transactions", authorize, createTransaction);
// router.patch("/users/:id", authorize, updateUser)
router.get("/transactions", authorize, getTransactions);
router.get("/transactions/:user_id", authorize, getUserTransactions);
// router.delete("/users", authorize, deleteUsers);

export {
    router as transactionsApi
}