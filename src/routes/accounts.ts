import { Router } from "express";
import { accounts } from "../controllers";
import { auth, admin, validator } from "../middlewares";
import { accounts as accountValidations } from "../validations";

const router = Router();

router
  .route("/")
  .get(validator(accountValidations.find), accounts.find)
  .post(admin, accounts.create);

router.route("/:id").get(accounts.findOne).put(admin, accounts.update);

export default router;
