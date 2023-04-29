import { v4 as uuidv4 } from "uuid";
import { WidgetModel } from "../db/models/WidgetModel";

interface CreateNewWidgetAttr {
  html: string;
  title: string;
  owner: string;
}

const DEFAULT_LIMIT = 10;

export const WidgetDAL = {
  get: (id: string) => {
    return WidgetModel.findByPk(id);
  },
  getList: (filters: {} = {}, limit = DEFAULT_LIMIT) => {
    return WidgetModel.findAll({
      order: [["createdAt", "DESC"]],
      where: filters,
      limit: limit,
    });
  },
  create: async (params: CreateNewWidgetAttr) => {
    const id = uuidv4();
    return WidgetModel.create(
      {
        id,
        html: params.html,
        title: params.title,
        owner: params.owner,
      },
      {
        returning: true,
      }
    );
  },
  destroy: (id: string) => {
    return WidgetModel.destroy({ where: { id } });
  },
};
