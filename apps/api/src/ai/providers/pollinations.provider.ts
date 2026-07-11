import { config } from "../../config";
import { logger } from "../../utils/logger";
import {
  type GeneratedProviderImage,
  type GenerateWeddingImageInput,
  type ImageGenerationProvider,
  type ProviderHealthStatus,
} from "./provider.interface";

type PollinationsErrorResponse = {
  error?: string | { message?: string };
  message?: string;
};

const pollinationsRequestTimeoutMs = 120_000;
const pollinationsReferenceImageModel = "kontext";

export class PollinationsProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "PollinationsProviderError";
  }
}

export class PollinationsProvider implements ImageGenerationProvider {
  readonly name = "pollinations";
  readonly model: string;

  constructor(
    private readonly apiKey = config.pollinations.apiKey,
    model = config.pollinations.imageModel,
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
    const prompt = this.buildPrompt(input);
    const { height, width } = getPollinationsImageSize(input.aspectRatio);
    const url = new URL(`/prompt/${encodeURIComponent(prompt)}`, "https://image.pollinations.ai");

    url.searchParams.set("model", this.model);
    url.searchParams.set("width", String(width));
    url.searchParams.set("height", String(height));
    url.searchParams.set("seed", String(input.seed));
    url.searchParams.set("nologo", "true");
    url.searchParams.set("private", "true");

    if (this.model === pollinationsReferenceImageModel) {
      url.searchParams.set("image", input.brideImageUrl);
    }

    logger.info(
      {
        model: this.model,
        request: {
          aspectRatio: input.aspectRatio,
          height,
          prompt: `${prompt.slice(0, 180)}${prompt.length > 180 ? "..." : ""}`,
          seed: input.seed,
          width,
        },
      },
      "Sending Pollinations image generation request",
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      method: "GET",
      signal: AbortSignal.timeout(pollinationsRequestTimeoutMs),
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new PollinationsProviderError(
          `Pollinations image generation timed out after ${pollinationsRequestTimeoutMs / 1000} seconds`,
        );
      }

      throw error;
    });

    if (!response.ok) {
      const body = await parsePollinationsError(response);
      throw new PollinationsProviderError(getPollinationsErrorMessage(body), response.status, body);
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";

    if (!contentType.startsWith("image/")) {
      const body = await response.text();
      throw new PollinationsProviderError("Pollinations did not return image data", response.status, body);
    }

    const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");

    logger.info(
      {
        contentType,
        height,
        model: this.model,
        seed: input.seed,
        width,
      },
      "Pollinations image generation response",
    );

    return {
      height,
      seed: input.seed,
      url: `data:${contentType};base64,${base64}`,
      width,
    };
  }

  private buildPrompt(input: GenerateWeddingImageInput) {
    const compactPrompt = getCompactWeddingPrompt(input.prompt);

    return [
      compactPrompt,
      `Bride reference image: ${input.brideImageUrl}. Groom reference image: ${input.groomImageUrl}. Preserve the couple's facial identity, age, skin tone, and natural expression as much as the provider supports.`,
      "Photorealistic Indian wedding portrait, elegant outfits, cinematic lighting, realistic hands, no text, no watermark.",
    ].join("\n\n");
  }
}

const getCompactWeddingPrompt = (prompt: string) => {
  const normalizedPrompt = prompt.replace(/\s+/g, " ").trim();

  if (normalizedPrompt.toLowerCase().includes("beach")) {
    return "Luxury Indian beach wedding portrait at sunset, elegant bride and groom, floral mandap, ocean backdrop, premium editorial photography.";
  }

  if (normalizedPrompt.toLowerCase().includes("temple") || normalizedPrompt.toLowerCase().includes("south indian")) {
    return "Luxury South Indian temple wedding portrait, bride in red gold saree with temple jewellery, groom in silk veshti, warm cinematic lighting.";
  }

  if (normalizedPrompt.toLowerCase().includes("palace") || normalizedPrompt.toLowerCase().includes("royal")) {
    return "Luxury royal Indian palace wedding portrait, bride in red gold bridal lehenga, groom in embroidered sherwani, Mughal arches, warm cinematic lighting.";
  }

  return normalizedPrompt.length > 700 ? normalizedPrompt.slice(0, 700) : normalizedPrompt;
};

const getPollinationsImageSize = (aspectRatio: string) => {
  if (aspectRatio === "1:1") {
    return { height: 512, width: 512 };
  }

  const [width, height] = aspectRatio.split(":").map(Number);
  return width > height ? { height: 512, width: 768 } : { height: 768, width: 512 };
};

const parsePollinationsError = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as PollinationsErrorResponse;
  }

  return { message: await response.text() };
};

const getPollinationsErrorMessage = (body: PollinationsErrorResponse) => {
  if (typeof body.error === "string" && body.error.trim().length > 0) {
    return body.error;
  }

  if (typeof body.error === "object" && body.error?.message) {
    return body.error.message;
  }

  if (body.message) {
    return body.message;
  }

  return "Pollinations image generation failed";
};

export const pollinationsProvider = new PollinationsProvider();
