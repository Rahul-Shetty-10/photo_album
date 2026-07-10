import { openAIProvider, type ImageGenerationProvider } from "./providers";

export class GeneratorService {
  constructor(private readonly provider: ImageGenerationProvider = openAIProvider) {}

  get model() {
    return this.provider.model;
  }

  get providerName() {
    return this.provider.name;
  }

  healthCheck() {
    return this.provider.healthCheck();
  }

  generateWeddingImage(input: Parameters<ImageGenerationProvider["generateWeddingImage"]>[0]) {
    return this.provider.generateWeddingImage(input);
  }
}

export const generatorService = new GeneratorService();
