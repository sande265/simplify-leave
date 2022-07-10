import { Plan } from "../../Schemas/plans.schema";
import { queryParams } from "../../types/queryTypes";

export const index = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips = page * limit - limit
    try {
        Plan<Document>.find(filter, {}, { limit: limit, sort: sortBy, skip: skips }).lean().exec(
            (error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
        )
    } catch (error) {
        return callback(error);
    }
}

export const indexOne = (_id: string | number, callback: Function) => {
    try {
        Plan<Document>.findOne({ _id }, {}, {}).lean().exec(
            (error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
        );
    } catch (error) {
        return callback(error);
    }
}

export const insert = async (payload: any, callback: Function) => {
    const plan = new Plan<Document>(payload);
    try {
        Plan<Document>.init();
        await plan.save();
        return callback(null, plan.toJSON());
    } catch (error) {
        return callback(error);
    }
}

export const modify = (_id: string, payload: any, callback: Function) => {
    try {
        Plan<Document>.findOneAndUpdate({ _id }, payload).lean().exec(
            (err: any, result: any) => {
                if (err) callback(err);
                else callback(null, result);
            }
        )
    } catch (error) {
        return callback(error);
    }
}

export const drop = (callback: Function) => {
    try {
        Plan<Document>.deleteMany({}, (err: any) => {
            if (err) {
                callback(err)
            } else {
                callback(null, {});
            }
        })
    } catch (error) {
        callback(error);
    }
}