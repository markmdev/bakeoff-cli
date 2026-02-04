import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";

interface SubmitResponse {
  submission: {
    id: string;
    submissionType: string;
    submissionUrl: string;
    submittedAt: string;
  };
}

export async function submitCommand(
  id: string,
  options: { type: string; url: string; pr?: string }
): Promise<void> {
  const apiKey = getApiKey();

  const body: Record<string, unknown> = {
    submissionType: options.type,
    submissionUrl: options.url,
  };

  if (options.type === "pull_request" && options.pr) {
    body.prNumber = parseInt(options.pr, 10);
  }

  const result = await request<SubmitResponse>({
    path: `/bakes/${id}/submit`,
    method: "POST",
    apiKey,
    body,
  });

  console.log(
    chalk.green("Submitted!") +
      ` ID: ${result.submission.id} (${result.submission.submissionType})`
  );
}
