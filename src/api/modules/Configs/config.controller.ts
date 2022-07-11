import { Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { localValidation } from "../../../helpers/validation.helper";
import { paginate } from "../../../middlewares/paginate.middleware";
import { Config } from "../../Schemas/config.schema";
import { drop, index, indexOne, insert, modify } from "./config.module";

export const buildExpressError = (error: ValidationError[]) => {
    return error.map((err: { [key: string]: any }) => {
        console.log("here", err);
        return {
            [err.param.replace(/[]/, "")]: [err.msg]
        }
    })
}

export const createConfig = (req: Request, res: Response) => {
    const body: any = req.body;
    // let error: Result<ValidationError> = validationResult(req);
    // console.log("error", error);
    
    if (false) {
        // res.status(422).json({
        //     message: buildExpressError(error.array()),
        //     error: true
        // })
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
                    message: "Config created successfully.",
                    details: result
                })
            }
        })
    }
}

export const updateConfig = (req: Request, res: Response) => {
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
                message: "Config updated successfully."
            })
        })
    }
}

export const deleteConfigs = (req: Request, res: Response) => {
    drop((err: any) => {
        if (err) {
            res.status(500).json({
                messsage: "Failed to drop all configs",
                _diag: err,
                error: true
            })
        }
        else res.json({
            message: "Config document dropped successfully."
        })
    })
}

export const getConfigs = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await Config.countDocuments();

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

export const getConfig = (req: Request, res: Response) => {
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