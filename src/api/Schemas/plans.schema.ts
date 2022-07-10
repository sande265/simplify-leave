import { model, Schema } from "mongoose";

const PlanSchema: Schema = new Schema({
    name: {
        type: Schema.Types.String,
        required: [true, "Plan name is required."]
    },
    type: {
        type: Schema.Types.String,
        enum: ["saving", "loan", "fixed_deposit"]
    },
    interest: {
        type: Schema.Types.Number,
        required: [true, "Please add intrest rate."]
    },
    tenure: {
        type: Schema.Types.Number,
    },
    tenure_type: {
        type: Schema.Types.String,
    },
    interval: {
        type: Schema.Types.Mixed,
    }
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "plans" });

// PlanSchema.virtual('transactions', {
//     ref: 'transactions',
//     localField: 'applicant',
//     foreignField: '_id',
// });

export const Plan = model("Plan", PlanSchema);