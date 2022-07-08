import { Leaves } from "../../Schemas/leaves.schema";
import { User } from "../../Schemas/user.schema";
import { queryParams } from "../User/userTypes";

export const insertLeave = async (payload: any, callback: Function) => {
    const leave = new Leaves<Document>(payload);
    try {
        Leaves<Document>.init();
        await leave.save();
        return callback(null, leave.toJSON());
    } catch (error) {
        return callback(error);
    }
}

export const indexLeaves = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips = page * limit - limit
    try {
        Leaves.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
        .populate("employee")
        .lean()
        .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
        );
    } catch (error) {
        return callback(error);
    }
}