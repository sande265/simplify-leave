const mongoose = require("mongoose");
require("dotenv").config();

export const db = mongoose.connection;

export const initateDB = () => {
    try {
        const user: any = process.env.DB_USER;
        const pass: any = process.env.DB_PASS;
        const host: any = process.env.DB_HOST;
        const port: any = process.env.DB_PORT;
        const url = `mongodb://${user}:${encodeURIComponent(pass)}@${host}:${port}`;
        mongoose.connect(url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            autoIndex: true 
        });
        db.once("open", function () {
            console.log("Connected successfully");
        });
    } catch (error: any) {
        db.on("error", () => console.log("error connecting to DB"))
    }
}