import { Router, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Speechmatics } from "./speechmatics";
import { config } from "../../config/config";

const speechmatics = new Speechmatics(config.speechmatics.apiKey);
export const translationRoute = Router();

translationRoute.post("/", async (req: Request, res: Response) => {
  if (!req.files || !req.files.audio) {
    console.log("### here0");

    return res.status(400).json();
  }

  const file = req.files.audio as UploadedFile;

  try {
    const translation = await speechmatics.getTranslationFromFile(file.data);

    console.log("### translation", translation, translation.length);

    if (typeof translation !== "string") {
      console.log("### here 3");

      return res.sendStatus(500);
    }

    return res.json({ result: translation });
  } catch (ex) {
    // @ts-ignore
    console.log("### ex", ex.response.data);
    return res.sendStatus(500);
  }
});
