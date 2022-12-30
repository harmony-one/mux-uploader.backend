import Mux from "@mux/mux-node";
import { config } from "../config";

const { Video } = new Mux(config.mux.tokenId, config.mux.tokenSecret);

export const mux = {
  createAsset: async (name: string, sourceUrl: string) => {
    const asset = await Video.Assets.create({
      input: sourceUrl,
      playback_policy: "public",
    });

    return asset;
  },
};
