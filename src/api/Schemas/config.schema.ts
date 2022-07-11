import { model, Schema } from "mongoose";

const ConfigSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    self: {
        type: Schema.Types.String
    },
    teams_users: [
        {
            name: {
                type: Schema.Types.String,
                required: [true, "application name is required"]
            },
            mail: {
                type: Schema.Types.String,
                required: [true, "Mail is required"]
            },
            tid: {
                type: String,
                required: true
            },
            type: {
                type: String
            }
        }
    ],
    applications: [
        {
            application_name: {
                type: Schema.Types.String,
                required: [true, "application name is required"]
            },
            endpoint: {
                type: String,
                required: true
            },
            external_auth: {
                type: Boolean
            },
            cinfo: String,
            authentication: String,
            method: String
        }
    ]
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, collection: "configs" });

ConfigSchema.virtual('employee', {
    ref: 'User',
    localField: 'applicant',
    foreignField: '_id',
});

export const Config = model("Config", ConfigSchema);