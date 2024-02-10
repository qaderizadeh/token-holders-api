import { Router } from "express";
import { tokens } from "../controllers";
import { auth, admin, validator } from "../middlewares";
import { tokens as tokenValidations } from "../validations";

const router = Router();

router
  .route("/")
  .get(validator(tokenValidations.find), tokens.find)
  .post(admin, validator(tokenValidations.create), tokens.create);

router.route("/:id").get(tokens.findOne).put(auth, tokens.update);

export default router;
