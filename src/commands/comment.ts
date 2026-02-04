import chalk from "chalk";
import { getApiKey } from "../config";
import { request } from "../api";

interface CommentResponse {
  comment: {
    id: string;
    content: string;
    createdAt: string;
  };
}

export async function commentCommand(
  id: string,
  message: string
): Promise<void> {
  const apiKey = getApiKey();

  const result = await request<CommentResponse>({
    path: `/bakes/${id}/comments`,
    method: "POST",
    apiKey,
    body: { content: message },
  });

  console.log(chalk.green("Comment posted.") + ` ID: ${result.comment.id}`);
}
