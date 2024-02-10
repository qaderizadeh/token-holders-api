import { DataTypes } from "sequelize";
import { db } from "../services";

const Transfer = db.sequelize.define(
  "transfer",
  {
    from: { type: DataTypes.STRING },
    to: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    hash: { type: DataTypes.STRING },
    block: { type: DataTypes.NUMBER },
    log: { type: DataTypes.NUMBER },
    checked: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    indexes: [{ unique: true, fields: ["hash", "log"] }],
  },
);

export default Transfer;
