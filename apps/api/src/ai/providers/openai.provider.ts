import { config } from "../../config";
import { logger } from "../../utils/logger";
import {
  type GeneratedProviderImage,
  type GenerateWeddingImageInput,
  type ImageGenerationProvider,
  type ProviderHealthStatus,
} from "./provider.interface";

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
  }>;
};

type OpenAIErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    param?: string;
    type?: string;
  };
};

export class OpenAIProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "OpenAIProviderError";
  }
}

export class OpenAIProvider implements ImageGenerationProvider {
  readonly name = "openai";
  readonly model: string;

  constructor(
    private readonly apiKey = config.openai.apiKey,
    model = config.openai.imageModel,
  ) {
    this.model = model;
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    return {
      status: this.apiKey && this.model ? "ok" : "error",
      provider: this.name,
      model: this.model,
    };
  }

  async generateWeddingImage(input: GenerateWeddingImageInput): Promise<GeneratedProviderImage> {
    const formData = new FormData();
    const prompt = this.buildPrompt(input);

    formData.append("model", this.model);
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", getOpenAIImageSize(input.aspectRatio));
    formData.append("image[]", await fetchImageFile(input.brideImageUrl, "bride"));
    formData.append("image[]", await fetchImageFile(input.groomImageUrl, "groom"));

    logger.info(
      {
        model: this.model,
        request: {
          aspectRatio: input.aspectRatio,
          prompt: `${prompt.slice(0, 180)}${prompt.length > 180 ? "..." : ""}`,
          seed: input.seed,
          size: getOpenAIImageSize(input.aspectRatio),
        },
      },
      "Sending OpenAI image edit request",
    );

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      body: formData,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      method: "POST",
    });

    const body = (await response.json()) as OpenAIImageResponse | OpenAIErrorResponse;

    if (!response.ok) {
      throw new OpenAIProviderError(getOpenAIErrorMessage(body), response.status, body);
    }

    const image = (body as OpenAIImageResponse).data?.[0];

    if (!image?.b64_json) {
      throw new OpenAIProviderError("OpenAI did not return generated image data", response.status, body);
    }

    logger.info(
      {
        model: this.model,
        revisedPrompt: image.revised_prompt,
        seed: input.seed,
      },
      "OpenAI image edit response",
    );

    return {
      seed: input.seed,
      url: `data:image/png;base64,${image.b64_json}`,
    };
  }

  private buildPrompt(input: GenerateWeddingImageInput) {
    return [
      input.prompt,
      `Use the two provided reference images as the bride and groom likeness references.`,
      `Create one wedding portrait with aspect ratio ${input.aspectRatio}.`,
    ].join("\n\n");
  }
}

const getOpenAIImageSize = (aspectRatio: string) => {
  if (aspectRatio === "1:1") {
    return "1024x1024";
  }

  const [width, height] = aspectRatio.split(":").map(Number);
  return width > height ? "1536x1024" : "1024x1536";
};

const fetchImageFile = async (url: string, name: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new OpenAIProviderError(`Could not download ${name} image for OpenAI request`, response.status);
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const extension = contentType.includes("png") ? "png" : "jpg";
  const blob = await response.blob();

  return new File([blob], `${name}.${extension}`, { type: contentType });
};

const getOpenAIErrorMessage = (body: OpenAIImageResponse | OpenAIErrorResponse) => {
  if ("error" in body && body.error?.message) {
    return body.error.message;
  }

  return "OpenAI image generation failed";
};

export const openAIProvider = new OpenAIProvider();
