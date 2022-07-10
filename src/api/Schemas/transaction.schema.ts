import { model, Schema } from "mongoose";

const TransactionSchema: Schema = new Schema({
    amount: {
        type: Schema.Types.Number,
        required: [true, "Amount is required."]
    },
    type: {
        type: Schema.Types.String,
        enum: ["debit", "credit"]
    },
    description: {
        type: Schema.Types.String,
        required: [true, "Description is required."]
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID of the person is required."]
    }
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "transactions" });

// TransactionSchema.virtual('transactions', {
//     ref: 'transactions',
//     localField: 'applicant',
//     foreignField: '_id',
// });

export const Transaction = model("Transaction", TransactionSchema);