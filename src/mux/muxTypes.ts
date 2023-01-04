import { Asset } from "@mux/mux-node";

export enum MuxEventName {
  VideoAssetCreated = "video.asset.created",
  VideoAssetReady = "video.asset.ready",
}

interface EventAttempt {
  webhook_id: number;
  response_status_code: number;
  response_headers: unknown;
  response_body: string;
  max_attempts: number;
  id: string;
  created_at: string;
  address: string;
}

export interface MuxEventBase<
  DataType,
  DataTypeName,
  EventName extends MuxEventName
> {
  type: EventName;
  request_id: null;
  object: { type: DataTypeName; id: string };
  id: string;
  environment: { name: string; id: string };
  data: DataType;
  created_at: string;
  attempts: EventAttempt[];
  accessor_source: null;
  accessor: null;
}

export type MuxEventVideoAssetReady = MuxEventBase<
  Asset,
  "asset",
  MuxEventName.VideoAssetReady
>;

export type MuxEventVideoAssetCreated = MuxEventBase<
  Asset,
  "asset",
  MuxEventName.VideoAssetCreated
>;

export type MuxEvents = MuxEventVideoAssetReady | MuxEventVideoAssetCreated;
