type TryOnInput = {
  humanImageDataUri: string;
  garmentImageDataUri: string;
  garmentDescription: string;
};

const DEFAULT_VERSION =
  "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000;

type ReplicatePrediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[] | null;
  error?: string | null;
};

async function getPrediction(
  id: string,
  token: string,
): Promise<ReplicatePrediction> {
  const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Replicate status error: ${response.status} ${body}`);
  }

  return response.json() as Promise<ReplicatePrediction>;
}

function extractOutputUrl(output: ReplicatePrediction["output"]): string {
  if (typeof output === "string" && output.length > 0) return output;
  if (Array.isArray(output) && typeof output[0] === "string") return output[0];
  throw new Error("Replicate returned empty output.");
}

async function waitForPrediction(
  id: string,
  token: string,
): Promise<ReplicatePrediction> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const prediction = await getPrediction(id, token);

    if (prediction.status === "succeeded") return prediction;

    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new Error(prediction.error ?? "Replicate prediction failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Replicate prediction timed out.");
}

export async function runReplicateVirtualTryOn(
  input: TryOnInput,
): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured. Add it to .env.local.",
    );
  }

  const version =
    process.env.REPLICATE_IDM_VTON_VERSION ?? DEFAULT_VERSION;

  const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input: {
        human_img: input.humanImageDataUri,
        garm_img: input.garmentImageDataUri,
        garment_des: input.garmentDescription,
        category: "dresses",
        force_dc: true,
        crop: true,
        steps: 30,
      },
    }),
  });

  if (!createResponse.ok) {
    const body = await createResponse.text();
    throw new Error(`Replicate create error: ${createResponse.status} ${body}`);
  }

  const created = (await createResponse.json()) as ReplicatePrediction;

  if (created.status === "succeeded") {
    return extractOutputUrl(created.output);
  }

  if (created.status === "failed" || created.status === "canceled") {
    throw new Error(created.error ?? "Replicate prediction failed.");
  }

  const finished = await waitForPrediction(created.id, token);
  return extractOutputUrl(finished.output);
}
