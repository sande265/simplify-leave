import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { paginate } from "../../../middlewares/paginate.middleware";
import { Account } from "../../Schemas/account.schema";
import { drop, index, indexOne, insert, modify } from "./account.module";

export const createAccount = (req: Request, res: Response) => {
    const body: any = req.body;
    const rule: Object = {
        user_id: ["required"],
        type: ["required", { param: "in", values: ["personal", "organizational"] }],
        balance: {},
        referee: {},
        plan_id: ["required"]
    }
    const { error, localvalidationerror } = localValidation(body, rule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error,
            error: true
        })
    } else {
        insert(body, (err: any, result: { [key: string]: string | string[] | number }) => {
            if (err) {
                res.status(500).json({
                    message: "Something went wrong",
                    _diag: err,
                    error: true
                })
            }
            else {
                res.json({
                    message: "Account created successfully.",
                    details: result
                })
            }
        })
    }
}

export const updateAccount = (req: Request, res: Response) => {
    const { id } = req.params;
    const body: any = req.body;
    const rule: Object = {
        user_id: ["required"],
        type: ["required", { param: "in", values: ["personal", "organizational"] }],
        balance: {},
        referee: {},
        plan_id: ["required"]
    }
    const { error, localvalidationerror } = localValidation(body, rule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error,
            error: true
        })
    } else {
        modify(id, { ...body }, (err: any) => {
            if (err)
                res.status(500).json({
                    message: "Something went wrong",
                    _diag: err,
                    error: true
                })
            else res.json({
                message: "Account updated successfully."
            })
        })
    }
}

export const deleteAccounts = (req: Request, res: Response) => {
    drop((err: any) => {
        if (err) {
            res.status(500).json({
                messsage: "Failed to drop all accounts",
                _diag: err,
                error: true
            })
        }
        else res.json({
            message: "Account document dropped successfully."
        })
    })
}

export const getAccounts = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await Account.countDocuments();

    index({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        else if (result.length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(paginate(result, limit, count, page));
        }
    })
};

export const getAccount = (req: Request, res: Response) => {
    const { id } = req.params;
    indexOne(id, (err: any, result: { [key: string]: any }) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        else if (!result || Object.keys(result).length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(result);
        }
    })
};