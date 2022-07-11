import { Router, Request, Response } from "express";
import { accountsApi } from "../api/modules/Account/accout.route";
import { configsApi } from "../api/modules/Configs/config.route";
import { leavesApi } from "../api/modules/Leaves/leaves.route";
import { authApi } from '../api/modules/Oauth/oauth.route';
import { plansApi } from "../api/modules/Plans/plans.route";
import { transactionsApi } from "../api/modules/Transactions/transactions.route";
import { usersApi } from "../api/modules/User/user.route";

const router: Router = Router();

router.use("/auth/v1/", authApi);
router.use("/user/v1/", usersApi);
router.use("/leave/v1/", leavesApi);
router.use("/account/v1/", accountsApi);
router.use("/plan/v1/", plansApi);
router.use("/transaction/v1/", transactionsApi);
router.use("/config/v1", configsApi);

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