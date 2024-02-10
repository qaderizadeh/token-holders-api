import { DataTypes } from "sequelize";
import { db } from "../services";

const Account = db.sequelize.define(
  "account",
  {
    address: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
  },
  {
    indexes: [{ unique: true, fields: ["tokenId", "address"] }],
  },
);

export default Account;
