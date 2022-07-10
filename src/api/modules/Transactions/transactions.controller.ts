import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { paginate } from "../../../middlewares/paginate.middleware";
import { Transaction } from "../../Schemas/transaction.schema";
import { index, insert, logs } from "./transactions.module";

export const createTransaction = (req: Request, res: Response) => {
    const body: any = req.body;
    const rule: { [key: string]: Array<string | { [key: string]: string | string[] }> } = {
        user_id: ["required", "min:6"],
        description: ["required"],
        amount: ["required"],
        type: ["required", { param: "in", values: ["debit", "credit"] },]
    }
    const { error, localvalidationerror } = localValidation(body, rule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error,
            error: true
        })
    } else {
        insert(body, (err: any, result: any) => {
            if (err) {
                res.status(500).json({
                    message: "Something went wrong",
                    error: true,
                    _diag: err,
                })
            }
            else {
                res.json({
                    message: "Transaction Successfully completed.",
                    details: result
                })
            }
        })
    }
}

export const getTransactions = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await Transaction.countDocuments();

    index({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        else if (result?.length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(paginate(result, limit, count, page));
        }
    })
};

export const getUserTransactions = async (req: Request, res: Response) => {
    let { user_id }: any = req.params;

    if (user_id) {
        logs(user_id, (err: any, result: Array<{ [key: string]: any }>) => {
            if (err) res.status(500).json({
                message: "Somthing went wrong",
                error: err
            })
            else if (result.length <= 0) {
                res.sendStatus(204);
            } else {
                res.json({
                    message: "Transaction logs retrived successfully.",
                    transactions: result
                });
            }
        })
    } else {
        res.status(422).json({
            message: "User Id is required.",
            error: true
        })
    }
};