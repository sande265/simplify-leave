import { model, Schema } from "mongoose";

const LeaveSchema: Schema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    days: {
        type: Number,
        required: true,
        match: /^\d{1,2}$/,
    },
    description: {
        type: String,
    },
    type: {
        type: Schema.Types.Mixed
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "leaves" });

LeaveSchema.virtual('employee', {
    ref: 'User',
    localField: 'applicant',
    foreignField: '_id',
});

export const Leaves = model("Leave", LeaveSchema);