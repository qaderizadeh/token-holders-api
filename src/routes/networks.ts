import { Router } from "express";
import { networks } from "../controllers";
import { auth, admin, validator } from "../middlewares";
import { networks as networkValidations } from "../validations";

const router = Router();

router
  .route("/")
  .get(validator(networkValidations.find), networks.find)
  .post(admin, networks.create);

router.route("/:id").get(networks.findOne).put(admin, networks.update);

export default router;
