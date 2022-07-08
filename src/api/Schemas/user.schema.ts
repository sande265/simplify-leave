import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Schema.Types.Mixed,
        default: null
    },
    role: {
        type: Schema.Types.Mixed,
        default: null
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true, versionKey: false });

UserSchema.methods.toJSON = function() {
    let data = this.toObject();
    delete data.password;
    return data;
}

export const User = model("User", UserSchema);