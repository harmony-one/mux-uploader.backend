import Mux from "@mux/mux-node";
import { config } from "../config/config";
import { runAssetWatcher } from "./assetWatcher";

const { Video } = new Mux(config.mux.tokenId, config.mux.tokenSecret);

export const mux = {
  createAsset: async (name: string, sourceUrl: string) => {
    return Video.Assets.create({
      input: sourceUrl,
      playback_policy: "public",
    });
  },
  loadAsset: async (assetId: string) => {
    return Video.Assets.get(assetId);
  },
  runAssetWatcher: () => {
    runAssetWatcher();
  },
};
