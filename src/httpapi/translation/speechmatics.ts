import axios from "axios";
import FormData from "form-data";

export class Speechmatics {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async postJobFile(file: Buffer) {
    const formData = new FormData();

    formData.append(
      "config",
      JSON.stringify({
        type: "transcription",
        transcription_config: {
          operating_point: "enhanced", // enhanced standard
          language: "en",
        },
      })
    );
    formData.append("data_file", file, "voice_memo" + Date.now());

    const { data } = await axios.post<{ id: string }>(
      "https://asr.api.speechmatics.com/v2/jobs/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return data.id;
  }

  private async postJob(dataUrl: string) {
    const formData = new FormData();
    formData.append(
      "config",
      JSON.stringify({
        type: "transcription",
        fetch_data: {
          url: dataUrl,
        },
        transcription_config: {
          operating_point: "enhanced", // enhanced standard
          language: "en",
          enable_entities: true,
          diarization: "speaker",
        },
      })
    );
    const { data } = await axios.post<{ id: string }>(
      "https://asr.api.speechmatics.com/v2/jobs/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return data.id;
  }

  private sleep = (timeout: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  private async getJobResult(jobId: string) {
    const { data } = await axios.get(
      `https://asr.api.speechmatics.com/v2/jobs/${jobId}/transcript?format=txt`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return data;
  }

  private async pollJobResult(jobId: string) {
    for (let i = 0; i < 600; i++) {
      try {
        const data = await this.getJobResult(jobId);
        return data;
      } catch (e) {
      } finally {
        await this.sleep(1000);
      }
    }
    return null;
  }

  public async getTranslation(dataUrl: string) {
    const jobIb = await this.postJob(dataUrl);
    console.log(`Start job ${jobIb}, audio url: ${dataUrl}`);
    return this.pollJobResult(jobIb);
  }

  public async getTranslationFromFile(file: Buffer) {
    const jobIb = await this.postJobFile(file);
    console.log(`Start job ${jobIb}, audio`);
    return this.pollJobResult(jobIb);
  }
}
