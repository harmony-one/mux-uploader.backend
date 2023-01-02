import { MuxAssetStatus, Video } from "../db/models/Video";
import { mux } from "./index";
import { VideoDAL } from "../dal/video";
import { ONE_SECOND } from "../constants/dates";
import { logger } from "../logger";

const updatePlaybackId = async (video: Video) => {
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
  }, ONE_SECOND * 5);
};
