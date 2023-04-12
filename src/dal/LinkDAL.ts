import { v4 as uuidv4 } from "uuid";
import { LinkModel } from "../db/models/LinkModel";
import { DomainModel } from "../db/models/DomainModel";

interface CreateNewLinkAttr {
  domainId: string;
  url: string;
}

const DEFAULT_LIMIT = 10;

export const LinkDAL = {
  create: async (params: CreateNewLinkAttr) => {
    const id = uuidv4();
    return LinkModel.create({
      id,
      domainId: params.domainId,
      url: params.url,
      rank: "0",
    });
  },
  get: (id: string) => {
    return LinkModel.findByPk(id);
  },
  getList: (filters: { domain?: string } = {}, limit = DEFAULT_LIMIT) => {
    return LinkModel.findAll({
      order: [["createdAt", "DESC"]],
      where: filters,
      include: [DomainModel],
      limit: limit,
    });
  },
  destroy: (id: string) => {
    return LinkModel.destroy({ where: { id } });
  },
};
