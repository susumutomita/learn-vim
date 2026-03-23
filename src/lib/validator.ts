export interface ValidationResult {
  isCorrect: boolean;
  diff?: string;
}

export function validateAnswer(
  userContent: string,
  expectedContent: string
): ValidationResult {
  const normalizedUser = normalize(userContent);
  const normalizedExpected = normalize(expectedContent);

  if (normalizedUser === normalizedExpected) {
    return { isCorrect: true };
  }

  const diff = generateSimpleDiff(normalizedExpected, normalizedUser);
  return { isCorrect: false, diff };
}

export function validateCommandInput(
  userInput: string,
  acceptedAnswers: string[]
): ValidationResult {
  const normalizedInput = userInput.trim().toLowerCase();
  const isCorrect = acceptedAnswers.some(
    (answer) => normalizedInput === answer.trim().toLowerCase()
  );
  return { isCorrect };
}

function normalize(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\s+$/, "").replace(/\n+$/, "");
}

function generateSimpleDiff(expected: string, actual: string): string {
  const expectedLines = expected.split("\n");
  const actualLines = actual.split("\n");
  const lines: string[] = [];
  const maxLen = Math.max(expectedLines.length, actualLines.length);

  for (let i = 0; i < maxLen; i++) {
    const exp = expectedLines[i];
    const act = actualLines[i];

    if (exp === act) {
      lines.push(`  ${exp ?? ""}`);
    } else {
      if (exp !== undefined) lines.push(`- ${exp}`);
      if (act !== undefined) lines.push(`+ ${act}`);
    }
  }

  return lines.join("\n");
}
