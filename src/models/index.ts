import Account from "./account";
import Network from "./network";
import Token from "./token";
import Transfer from "./transfer";
import User from "./user";

Network.hasMany(Token);
Token.belongsTo(Network);

Token.hasMany(Transfer);
Transfer.belongsTo(Token);

Token.hasMany(Account);
Account.belongsTo(Token);

export { Account, Network, Token, Transfer, User };
