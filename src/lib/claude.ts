import { execFile } from "child_process";

export function askClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      "claude",
      ["-p", prompt, "--output-format", "json"],
      { timeout: 60000, maxBuffer: 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`claude CLI error: ${err.message}\n${stderr}`));
          return;
        }
        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed.result || parsed.content || stdout);
        } catch {
          resolve(stdout.trim());
        }
      }
    );
  });
}

export function askClaudeJSON<T>(prompt: string): Promise<T> {
  const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON, no markdown code blocks, no explanation. Just the raw JSON object.`;
  return askClaude(jsonPrompt).then((result) => {
    const cleaned = result.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned) as T;
  });
}
