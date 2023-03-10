import { v4 as uuidv4 } from "uuid";
import { DomainModel } from "../db/models/DomainModel";

interface CreateNewDomainAttr {
  domain: string;
  createdTxHash: string;
}

export const DomainDAL = {
  get: (domainName: string) => {
    return DomainModel.findOne({ where: { domain: domainName } });
  },
  create: (params: CreateNewDomainAttr) => {
    const { domain, createdTxHash } = params;
    const id = uuidv4();
    return DomainModel.create({
      id: id,
      domain: domain,
      createdTxHash: createdTxHash,
    });
  },
};
