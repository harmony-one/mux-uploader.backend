import { Server } from "socket.io";
import { createSmClient } from "./utils";
import { SpeachMaticClient } from "./Speachmatics";

const mapSocketToSmClient = new Map<string, SpeachMaticClient>();

export const createWsServer = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("StartRecognition", async () => {
      const smClient = await createSmClient();

      if (!smClient) {
        return;
      }

      mapSocketToSmClient.set(socket.id, smClient);

      smClient.on("ReadyToTranslation", () => {
        socket.emit("ReadyToTranslation");
      });

      smClient.on("AddTranscript", (data) => {
        socket.emit("AddTranscript", data);
      });

      smClient.on("AddPartialTranscript", (data) => {
        socket.emit("AddPartialTranscript", data);
      });
    });

    socket.on("AddAudio", (data) => {
      const client = mapSocketToSmClient.get(socket.id);

      if (client) {
        client.addAudio(data);
      }
    });

    socket.on("EndOfStream", () => {
      const client = mapSocketToSmClient.get(socket.id);

      if (client) {
        client.close();
        mapSocketToSmClient.delete(socket.id);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");

      const client = mapSocketToSmClient.get(socket.id);

      if (client) {
        client.close();
      }

      mapSocketToSmClient.delete(socket.id);
    });
  });
};
