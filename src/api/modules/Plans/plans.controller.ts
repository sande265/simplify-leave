import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { paginate } from "../../../middlewares/paginate.middleware";
import { Plan } from "../../Schemas/plans.schema";
import { drop, index, indexOne, insert, modify } from "./plans.module";

export const createPlan = (req: Request, res: Response) => {
    const body: any = req.body;
    const rule: Object = {
        name: ["required"],
        type: ["required", { param: "in", values: ["saving", "loan", "fixed_deposit"] }],
        tenure: body?.type === "fixed_deposit" ? ["required"] : {},
        tenure_type: body?.type === "fixed_deposit" ? ["required", { param: "in", values: ["year", "month", "days"] }] : {},
        interest: ["required"]
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
                    message: "Plan created successfully.",
                    details: result
                })
            }
        })
    }
}

export const updatePlan = (req: Request, res: Response) => {
    const { id } = req.params;
    const body: any = req.body;
    const rule: Object = {
        name: ["required"],
        type: ["required", { param: "in", values: ["saving", "loan", "fixed_deposit"] }],
        tenure: body?.type === "fixed_deposit" ? ["required"] : {},
        tenure_type: body?.type === "fixed_deposit" ? ["required", { param: "in", values: ["year", "month", "days"] }] : {},
        interest: ["required"]
    }
    const { error, localvalidationerror } = localValidation(body, rule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error,
            error: true
        })
    } else {
        modify(id, { ...body }, (err: any) => {
            if (err) res.status(500).json({
                message: "Something went wrong",
                _diag: err,
                error: true
            })
            else res.json({
                message: "Plan updated successfully."
            })
        })
    }
}

export const deletePlans = (req: Request, res: Response) => {
    drop((err: any) => {
        if (err) {
            res.status(500).json({
                messsage: "Failed to drop all plans",
                _diag: err,
                error: true
            })
        }
        else res.json({
            message: "Plan document dropped successfully."
        })
    })
}

export const getPlans = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await Plan.countDocuments();

    index({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        if (result.length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(paginate(result, limit, count, page));
        }
    })
};

export const getPlan = (req: Request, res: Response) => {
    const { id } = req.params;
    indexOne(id, (err: any, result: { [key: string]: any }) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        if (!result || Object.keys(result).length <= 0) {
            res.sendStatus(204);
        } else {
            res.json({
                data: result,
                id: id
            })
        }
    })
};