import { v4 as uuidv4 } from "uuid";
import { MessageModel } from "../db/models/MessageModel";

interface CreateNewMessageAttr {
  content: string;
  domain: string;
}

const DEFAULT_LIMIT = 10;

export const MessageDAL = {
  get: (messageId: string) => {
    return MessageModel.findByPk(messageId);
  },
  create: async (params: CreateNewMessageAttr) => {
    const id = uuidv4();
    return MessageModel.create({
      id: id,
      domain: params.domain,
      content: params.content,
    });
  },
  getList: (filters: { domain?: string } = {}, limit = DEFAULT_LIMIT) => {
    return MessageModel.findAll({
      order: [["createdAt", "DESC"]],
      where: filters,
      limit: limit,
    });
  },
  destroy: (messageId: string) => {
    return MessageModel.destroy({ where: { id: messageId } });
  },
};
