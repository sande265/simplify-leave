import { model, Schema } from "mongoose";

const AccountSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."]
    },
    balance: {
        type:  Schema.Types.Number,
        default: 0
    },
    type: {
        type: Schema.Types.String,
        enum: ["personal", "organizational"]
    },
    referee: {
        type:  Schema.Types.String,
        default: null
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "accounts" });

AccountSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: 'user_id',
    foreignField: 'account',
});

AccountSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
});

AccountSchema.virtual('plan', {
    ref: 'Plan',
    localField: 'plan_id',
    foreignField: '_id',
});

export const Account = model("Account", AccountSchema);