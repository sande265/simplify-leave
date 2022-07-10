import { Account } from "../../Schemas/account.schema";
import { Transaction } from "../../Schemas/transaction.schema";
import { queryParams } from "../../types/queryTypes";
import { modify as modifyAccount } from "../Account/account.module";

export const insert = async (payload: any, callback: Function) => {
    const transaction = new Transaction<Document>(payload);
    try {
        const account: any = await Account.findOne({ user_id: payload.user_id })
        const balance: number = payload.type === "debit" ? (account.balance + payload.amount) : (account.balance - payload.amount)
        if (account) {
            Transaction<Document>.init();
            await transaction.save();
            modifyAccount(account._id, {
                balance: balance
            }, (err: any, result: any) => {
                if (err) callback(err)
                else {
                    return callback(null, transaction.toJSON());
                }
            })
        } else {
            callback("Account not found, transaction failed.")            
        }
    } catch (error: any) {
        return callback(error);
    }
}

export const index = ({ limit, page, sortBy, filter }: queryParams, callback: Function) => {
    const skips: number = page * limit - limit
    try {
        Transaction.find(filter, {}, { limit: limit, sort: sortBy, skip: skips })
            .lean()
            .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
            );
    } catch (error: any) {
        return callback(error);
    }
}

export const indexOne = (id: string | number, callback: Function) => {
    try {
        Transaction.find({ _id: id })
            .lean()
            .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            }
            );
    } catch (error: any) {
        return callback(error);
    }
}

export const logs = (user_id: string, callback: Function) => {
    try {
        Transaction.find({ user_id: user_id })
            .lean()
            .exec((error: any, result: any) => {
                if (error) callback(error);
                else return callback(null, result);
            });
    } catch (error: any) {
        return callback(error);
    }
}