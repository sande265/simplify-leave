import { Request, Response } from "express";
import { localValidation } from "../../../helpers/validation.helper";
import { createMailTransport } from "../../../middlewares/mailing.middleware";
import { paginate } from "../../../middlewares/paginate.middleware";
import { Leaves } from "../../Schemas/leaves.schema";
import { User } from "../../Schemas/user.schema";
import { indexLeaves, insertLeave } from "./leaves.module";

export const createLeave = async (req: Request, res: Response) => {
    const body: any = req.body;
    const rule: Object = {
        applicant: ["required"],
        days: ["required", "numeric"],
        from: ["required", "date"],
        to: ["required", "date"],
        description: ["required"]
    }
    const { error, localvalidationerror } = localValidation(body, rule, {}, false);
    if (localvalidationerror) {
        res.status(422).json({
            message: error
        })
    } else {
        let user: any = await User<Document>.findOne({ _id: body.applicant })
        createMailTransport(
            { days: body.days, from: body.from, to: body.to, description: body.description },
            "sandeshsingh265@gmail.com", (err: any, result: any) => {
                if (err) res.status(500).json({
                    message: "Failed to apply leave",
                    _diag: err
                })
                else {
                    let { name } = user;
                    // fetch()
                    res.status(201).json({});
                }
            });
        // insertLeave(body, (err: any, result: any) => {
        //     if (err) {
        //         res.status(500).json({
        //             message: "Something went wrong",
        //             _diag: err,
        //         })
        //     }
        //     else {
        //         res.json({
        //             message: "Leave applied successfully.",
        //             details: result
        //         })
        //     }
        // })
    }
}

export const getLeaves = async (req: Request, res: Response) => {
    let { limit, q, page }: any = req.query;
    limit = limit ? parseInt(limit) : 10;

    const count = await Leaves.countDocuments();

    indexLeaves({ limit: limit, page: page }, (err: any, result: Array<[]>) => {
        if (err) res.status(500).json({
            message: "Somthing went wrong",
            _diag: err,
            error: true
        })
        if (result?.length <= 0) {
            res.sendStatus(204);
        } else {
            res.json(paginate(result, limit, count, page));
        }
    })
};