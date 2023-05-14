import { ErrorEvent, MessageEvent, WebSocket } from "ws";
import { EventEmitter } from "events";

interface TranscriptResult {
  confidence: number;
  content: string;
}

interface TranscriptBase {
  alternatives: TranscriptResult[];
  start_time: number;
  end_time: number;
}

interface TranscriptWord extends TranscriptBase {
  type: "word";
}

interface TranscriptPunctuation extends TranscriptBase {
  type: "punctuation";
  is_eos: boolean;
}

type TranscriptItem = TranscriptWord | TranscriptPunctuation;

interface TranscriptMetadata {
  start_time: number;
  end_time: number;
  transcript: string;
}

export interface AddTranscript {
  message: "AddTranscript";
  metadata: TranscriptMetadata;
  results: TranscriptItem[];
}

export interface AddPartialTranscript {
  message: "AddPartialTranscript";
  metadata: TranscriptMetadata;
  results: TranscriptItem[];
}

type LocalEventTypes = {
  ReadyToTranslation: undefined[];
  AddPartialTranscript: [AddPartialTranscript];
  AddTranscript: [AddTranscript];
  EndOfStream: [{ message: "EndOfStream"; last_seq_no: number }];
  EndOfTranscript: [{ message: "EndOfTranscript" }];
};

export class SpeachMaticClient {
  ws: WebSocket;
  private __emitter = new EventEmitter();
  private __seqCount = 0;

  constructor(key: string) {
    this.handleMessage = this.handleMessage.bind(this);
    this.handleOpenEvent = this.handleOpenEvent.bind(this);
    this.handleError = this.handleError.bind(this);

    this.ws = new WebSocket(`wss://eu2.rt.speechmatics.com/v2/en`, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    this.ws.addEventListener("open", this.handleOpenEvent);
    this.ws.addEventListener("message", this.handleMessage);
    this.ws.addEventListener("error", this.handleError);
  }

  public on<TEventName extends keyof LocalEventTypes>(
    eventName: TEventName,
    listener: (...args: [LocalEventTypes[TEventName]]) => void
  ) {
    console.log("### listener", eventName);
    this.__emitter.on(eventName, listener);
  }

  public addAudio(str: string) {
    this.ws.send(str);
    this.__seqCount++;
  }

  private handleMessage(event: MessageEvent) {
    console.log("### event.data", event.data);
    if (typeof event.data === "string") {
      const msg = JSON.parse(event.data);

      if (msg.message === "RecognitionStarted") {
        this.__emitter.emit("ReadyToTranslation");
        return;
      }

      if (msg.message === "AddPartialTranscript") {
        this.__emitter.emit("AddPartialTranscript", msg);
        return;
      }

      if (msg.message === "AddTranscript") {
        this.__emitter.emit("AddTranscript", msg);
        return;
      }

      if (msg.message === "EndOfTranscript") {
        this.__emitter.emit("EndOfTranscript", msg);
        this.ws.close();
      }
    }
  }

  private handleError(eventError: ErrorEvent) {
    console.error("WebSocket error:", eventError);
  }

  private handleOpenEvent() {
    console.log("### open");
    const message = {
      message: "StartRecognition",
      audio_format: {
        type: "raw",
        encoding: "pcm_f32le",
        sample_rate: 16000,
      },
      transcription_config: {
        language: "en",
        // output_locale: "en-US",
        // additional_vocab: ["gnocchi", "bucatini", "bigoli"],
        // diarization: "speaker_change",
        enable_partials: true,
        // punctuation_overrides: {
        //   permitted_marks: [",", "."],
        // },
      },
    };
    this.ws.send(JSON.stringify(message), (err: any) => {
      if (err) {
        console.log("### err", err);
      }
    });
  }

  public close() {
    this.ws.send(
      JSON.stringify({ message: "EndOfStream", last_seq_no: this.__seqCount })
    );
  }
}
