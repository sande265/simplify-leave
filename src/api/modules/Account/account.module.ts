import { Account } from "../../Schemas/account.schema";
import { queryParams } from "../../types/queryTypes";

export const index = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips = page * limit - limit
    try {
        Account<Document>.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
            .populate("user", "name email address username")
            .populate("plan", "name type interest")
            .lean()
            .exec((error: any, result: any) => {
                if (error) callback(error);
                else {
                    if (result.length > 0) {
                        result.forEach((item: any) => {
                            if (item) {
                                delete item.user_id;
                                delete item.plan_id;
                                item.user = item?.user?.length > 0 ? item.user[0] : null
                                item.plan = item?.plan?.length > 0 ? item.plan[0] : null
                            }
                        })
                    }
                    return callback(null, result);
                }
            })
    } catch (error) {
        return callback(error);
    }
}

export const indexOne = (_id: string | number, callback: Function) => {
    try {
        Account<Document>.findOne({ _id })
            .populate("user", "name email address username")
            .populate("plan", "name type interest")
            .lean()
            .exec((error: any, result: any) => {
                if (error) callback(error);
                else {
                    if (result) {
                        delete result.user_id;
                        delete result.plan_id;
                        result.user = result?.user?.length > 0 ? result.user[0] : null
                        result.plan = result?.plan?.length > 0 ? result.plan[0] : null
                    }
                    return callback(null, result);
                }
            });
    } catch (error) {
        return callback(error);
    }
}

export const insert = async (payload: any, callback: Function) => {
    const account = new Account<Document>(payload);
    try {
        Account<Document>.init();
        await account.save();
        return callback(null, account.toJSON());
    } catch (error) {
        return callback(error);
    }
}

export const modify = async (_id: string, payload: any, callback: Function) => {
    try {
        let account = await Account<Document>.findOne({ _id });
        if (account) {
            Account<Document>.findOneAndUpdate({ _id }, payload, { new: true })
                .lean()
                .exec((err: any, result: any) => {
                    if (err) callback(err);
                    else callback(null, result);
                })
        } else {
            callback({ message: "Account not found." })
        }
    } catch (error) {
        return callback(error);
    }
}

export const drop = (callback: Function) => {
    try {
        Account<Document>.deleteMany({}, (err: any) => {
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