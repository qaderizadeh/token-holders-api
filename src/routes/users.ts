import { Router } from "express";
import { users } from "../controllers";
import { auth, admin, validator } from "../middlewares";
import { users as userValidations } from "../validations";

const router = Router();

router.route("/login").post(validator(userValidations.login), users.login);

router
  .route("/")
  .get(auth, validator(userValidations.find), users.find)
  .post(admin, users.create);

router.route("/:id").get(auth, users.findOne).put(auth, users.update);

export default router;
