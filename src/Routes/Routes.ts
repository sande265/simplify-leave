import { Router, Request, Response } from "express";
import { leavesApi } from "../api/modules/Leaves/leaves.route";
import { authApi } from '../api/modules/Oauth/oauth.route';
import { usersApi } from "../api/modules/User/user.route";

const router: Router = Router();

router.use("/auth/v1/", authApi);
router.use("/user/v1/", usersApi);
router.use("/leave/v1/", leavesApi);

router.use('*', (req: Request, res: Response) => {
    res.status(404)
    if (req?.headers?.accept?.indexOf('html'))
        // res.render('404', { url: req.protocol + '://' + req.get('host') + req.originalUrl })
        res.json({
            message: "Route not found"
        })
    else
        res.send("URL cannot found")
})

export {
    router as routes
}