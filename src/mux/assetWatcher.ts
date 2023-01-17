import { MuxAssetStatus, VideoModel } from "../db/models/VideoModel";
import { mux } from "./index";
import { VideoDAL } from "../dal/VideoDAL";
import { ONE_HOUR } from "../constants/dates";
import { logger } from "../logger";

export const updatePlaybackId = async (video: VideoModel) => {
  const asset = await mux.loadAsset(video.muxAssetId);

  if (!asset) {
    return false;
  }

  if (asset.status === "errored") {
    await video.update({ muxAssetStatus: MuxAssetStatus.ERROR });
    return false;
  }

  if (!asset.playback_ids || !asset.playback_ids[0]) {
    return false;
  }

  const playbackId = asset.playback_ids[0].id;

  await video.update({
    muxPlaybackId: playbackId,
    muxAssetStatus: MuxAssetStatus.READY,
  });
  return true;
};

const muxAssetStatusWatcher = async () => {
  const list = await VideoDAL.listPreparingVideo();

  for (let i = 0; i < list.length; i++) {
    try {
      await updatePlaybackId(list[i]);
    } catch (err) {
      logger.error("mux sync error", err);
    }
  }
};

export const runAssetWatcher = () => {
  return setTimeout(async () => {
    await muxAssetStatusWatcher().catch((err) => {
      logger.error("mux sync error", err);
    });
    runAssetWatcher();
  }, ONE_HOUR * 5);
};
