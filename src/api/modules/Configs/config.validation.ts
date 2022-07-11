import { body, check, ValidationChain } from "express-validator"

export const validation: ValidationChain[] = [
    check("self").not().isEmpty().withMessage("Self is required"),
    check("teams_users").not().isEmpty().withMessage("Team users is required"),
    check("teams_users.*.name").not().isEmpty().withMessage("Team Member name is required"),
    check("teams_users.*.tid").not().isEmpty().withMessage("Team Member ID is required"),
    check("teams_users.*.type").not().isEmpty().withMessage("Team Member type is required"),
    check("applications").not().isEmpty().withMessage("Applications is required"),
    check("applications.*.name").not().isEmpty().withMessage("Application name is required"),
    check("applications.*.endpoint").not().isEmpty().withMessage("Application name is required"),
    check("applications.*.external_auth").not().isEmpty().withMessage("Application name is required"),
]

