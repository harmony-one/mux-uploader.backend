import express from "express";

export const httpAPI = express();

httpAPI.get("/", async (req, res) => {
  return res.send({ foo: "bar" });
});
