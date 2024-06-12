import { Sequelize } from "sequelize";
import { crawler } from "./";

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || "", {
  logging: false,
});

sequelize.authenticate().then(function () {
  console.log("db connected!");
  sequelize.sync().then(() => {
    console.log("tables are synced!");
    crawler.run();
  });
});

export { sequelize };
