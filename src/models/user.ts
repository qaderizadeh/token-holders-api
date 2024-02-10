import { DataTypes } from "sequelize";
import { db } from "../services";

const User = db.sequelize.define("user", {
  username: { type: DataTypes.STRING, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  passwordSalt: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});

export default User;
