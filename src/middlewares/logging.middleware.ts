import { NextFunction, Request, Response } from "express";
import { getActualRequestDurationInMilliseconds } from "../shared";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {

    next();

    const cleanup = () => {
        res.removeListener('end', logFn)
        res.removeListener('close', abortFn)
        res.removeListener('error', errorFn)
    }

    const logFn = () => {
        cleanup();
        let current_datetime = new Date();
        let formatted_date =
            current_datetime.getFullYear() +
            "-" +
            (current_datetime.getMonth() + 1) +
            "-" +
            current_datetime.getDate() +
            " " +
            current_datetime.getHours() +
            ":" +
            current_datetime.getMinutes() +
            ":" +
            current_datetime.getSeconds();
        let method = req.method;
        let url = req.url;
        let requestedBy = req.socket?.remoteAddress;
        let status = res.statusCode;
        const start = process.hrtime();
        const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
        let log = `${requestedBy?.replace(/^[^0-9]+/, "")} -> [${formatted_date}] %s${method}\x1b[0m: ${url} %s${status}\x1b[0m ${durationInMilliseconds.toLocaleString()} ms`;
        console.log(log, getColor(method), getColor(status));
    }

    const abortFn = () => {
        cleanup()
        console.warn('Request aborted by the client')
    }

    const errorFn = (err: any) => {
        cleanup();
        console.error(`Request pipeline error: ${err}`)
    }

    res.on('finish', logFn) // successful pipeline (regardless of its response)
    res.on('close', abortFn) // aborted pipeline
    res.on('error', errorFn)

}

const getColor = (method: String | number) => {
    if (method === "GET" || method.toString().match(/2\d\d/))
        return "\x1b[32m";
    else if (method === "POST" || method.toString().match(/3\d\d/))
        return "\x1b[33m";
    else if (method === "DELETE" || method.toString().match(/4\d\d/))
        return "\x1b[31m";
    else if (method === 'PUT' || method.toString().match(/5\d\d/))
        return "\x1b[34m";
    else if (method === "PATCH")
        return "\x1b[37m";
    else
        return "\x1b[32m";
}