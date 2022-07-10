import { Leaves } from "../../Schemas/leaves.schema";
import { queryParams } from "../../types/queryTypes";

export const insertLeave = async (payload: any, callback: Function) => {
    const leave = new Leaves<Document>(payload);
    try {
        Leaves<Document>.init();
        await leave.save();
        return callback(null, leave.toJSON());
    } catch (error: any) {
        return callback(error);
    }
}

export const indexLeaves = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips: number = page * limit - limit
    try {
        Leaves.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
        .lean()
        .populate("employee", "username email name contact")
        .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
        );
    } catch (error: any) {
        return callback(error);
    }
}