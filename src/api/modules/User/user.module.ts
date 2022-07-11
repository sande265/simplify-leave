import { User } from "../../Schemas/user.schema";
import { queryParams } from "../../types/queryTypes";

export const indexUsers = async ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips = page * limit - limit
    try {
        User<Document>.find(filter, {}, { limit: limit, sort: sortBy, skip: skips }).lean().exec(
            (error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
        )
    } catch (error) {
        return callback(error);
    }
}

export const indexUser = (_id: string | number, callback: Function) => {
    try {
        User<Document>.findOne({ _id }, {}, {})
        .populate("configs", "_id self teams_users applications")
        .lean()
        .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            });
    } catch (error) {
        return callback(error);
    }
}

export const insertUser = async (payload: any, callback: Function) => {
    const user = new User<Document>(payload);
    try {
        User<Document>.init();
        await user.save();
        return callback(null, user.toJSON());
    } catch (error) {
        return callback(error);
    }
}

export const modifyUser = (_id: string, payload: any, callback: Function) => {
    try {
        User<Document>.findByIdAndUpdate({ _id }, payload, { new: true })
            .lean()
            .exec((err: any, result: any) => {
                if (err) callback(err);
                else callback(null, result);
            })
    } catch (error) {
        return callback(error);
    }
}

export const dropUsers = (callback: Function) => {
    try {
        User<Document>.deleteMany({}, (err: any) => {
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