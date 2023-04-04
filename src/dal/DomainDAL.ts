import { v4 as uuidv4 } from "uuid";
import { DomainModel } from "../db/models/DomainModel";

interface CreateNewDomainAttr {
  domain: string;
  referral?: string;
}

interface UpdateDomainAttr {
  domainId: string;
  data: {
    bgColor: string;
  };
}
export const DomainDAL = {
  get: (domainName: string) => {
    return DomainModel.findOne({ where: { domain: domainName } });
  },

  list: ({ offset = 0, limit = 100 }: { offset?: number; limit?: number }) => {
    return DomainModel.findAll({
      limit,
      offset,
      order: [["createdAt", "ASC"]],
    });
  },

  create: (params: CreateNewDomainAttr) => {
    const { domain, referral } = params;
    const id = uuidv4();
    return DomainModel.create({
      id: id,
      domain: domain,
      referral: referral,
    });
  },
  update: async (params: UpdateDomainAttr) => {
    const { domainId, data } = params;

    const domain = await DomainModel.findByPk(domainId);

    if (!domain) {
      throw new Error("domain doesnt exist");
    }

    return domain.update({
      bgColor: data.bgColor || domain.bgColor,
    });
  },
};
