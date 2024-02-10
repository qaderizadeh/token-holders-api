import { Router } from "express";
import { transfers } from "../controllers";
import { auth, admin, validator } from "../middlewares";
import { transfers as transferValidations } from "../validations";

const router = Router();

router
  .route("/")
  .get(validator(transferValidations.find), transfers.find)
  .post(admin, transfers.create);

router.route("/:id").get(transfers.findOne).put(auth, transfers.update);

export default router;
