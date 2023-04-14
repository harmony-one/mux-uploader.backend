import { v4 as uuidv4 } from "uuid";
import { LinkModel } from "../db/models/LinkModel";
import { DomainModel } from "../db/models/DomainModel";

interface CreateNewLinkAttr {
  domainId: string;
  linkId: string;
  url: string;
}

const DEFAULT_LIMIT = 10;

export const LinkDAL = {
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
  create: async (params: CreateNewLinkAttr) => {
    const id = uuidv4();
    return LinkModel.create(
      {
        id,
        domainId: params.domainId,
        linkId: params.linkId,
        isPinned: false,
        url: params.url,
        rank: "0",
      },
      {
        returning: true,
      }
    );
  },
  pin: async (id: string, isPinned: boolean) => {
    // Only one link can be pinned
    await LinkModel.update(
      { isPinned: false },
      {
        where: {},
      }
    );
    return await LinkModel.update(
      { isPinned },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
  },
  destroy: (id: string) => {
    return LinkModel.destroy({ where: { id } });
  },
};
