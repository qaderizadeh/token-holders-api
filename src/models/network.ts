import { DataTypes } from "sequelize";
import { db } from "../services";

const Network = db.sequelize.define("network", {
  name: { type: DataTypes.STRING },
  url: { type: DataTypes.STRING },
});

export default Network;
