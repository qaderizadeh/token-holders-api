import { DataTypes } from "sequelize";
import { db } from "../services";

const Token = db.sequelize.define("token", {
  address: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  symbol: { type: DataTypes.STRING },
  decimals: { type: DataTypes.NUMBER },
  block: { type: DataTypes.NUMBER }, // init block number
});

export default Token;
