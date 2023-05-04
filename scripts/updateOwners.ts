import { sequelize } from "../src/db/models";
import { DomainModel } from "../src/db/models/DomainModel";
import { loadDomainOwner } from "../src/httpapi/domain/dcContract";

const main = async () => {
  await sequelize.authenticate();

  const rewardList = await DomainModel.findAll();

  for (const domainItem of rewardList) {
    domainItem.owner = await loadDomainOwner(domainItem.domain);
    await domainItem.save();
  }

  console.log("### done");
};

main();
