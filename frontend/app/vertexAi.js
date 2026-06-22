const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "rwikistat-402509",
  location: "asia-southeast1",
});
const model = "gemini-pro";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    max_output_tokens: 2048,
    temperature: 0.9,
    top_p: 1,
  },
});

async function generateContent() {
  const req = {
    contents: [{ role: "user", parts: [{ text: "kamu adalah rwikibot" }] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  for await (const item of streamingResp.stream) {
    process.stdout.write("stream chunk: " + item);
  }

  process.stdout.write(
    "aggregated response: " + (await streamingResp.response)
  );
}

generateContent();
