import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../db/models/UserModel";
import { generateNonce } from "../httpapi/auth/authUtils";

interface CreateNewUser {
  address: string;
}

export const UserDAL = {
  createNewUser: async (params: CreateNewUser) => {
    const nonce = generateNonce();
    const id = uuidv4();
    return UserModel.create({
      id: id,
      nonce: nonce,
      address: params.address,
    });
  },
  get: async (userId: string) => {
    return UserModel.findByPk(userId);
  },
  getByAddress: (address: string) => {
    return UserModel.findOne({
      where: {
        address,
      },
    });
  },
  updateNonce: (user: UserModel) => {
    return user.update({
      nonce: generateNonce(),
    });
  },
};
