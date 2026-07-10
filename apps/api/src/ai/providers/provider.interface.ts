export type ProviderHealthStatus = {
  status: "ok" | "error";
  provider: string;
  model: string;
};

export type GenerateWeddingImageInput = {
  brideImageUrl: string;
  groomImageUrl: string;
  prompt: string;
  aspectRatio: string;
  seed: number;
};

export type GeneratedProviderImage = {
  url: string;
  seed: number;
  width?: number;
  height?: number;
};

export interface ImageGenerationProvider {
  readonly name: string;
  readonly model: string;

  healthCheck(): Promise<ProviderHealthStatus>;
  generateWeddingImage(input: GenerateWeddingImageInput): Promise<GeneratedProviderImage>;
}
