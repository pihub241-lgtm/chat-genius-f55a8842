export type Msg = { role: "user" | "assistant"; content: string };

// ─── Points to Express backend on localhost:5000 ───
const BACKEND_URL = "http://localhost:5000";

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1);

    const resp = await fetch(`${BACKEND_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: lastMessage.content,
        history: history,
      }),
    });

    if (resp.status === 429) {
      onError("Rate limit exceeded. Please wait a moment and try again.");
      return;
    }
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      onError(data.error || "Failed to get a response. Please try again.");
      return;
    }

    const data = await resp.json();
    if (data.reply) {
      onDelta(data.reply);
    }
    onDone();
  } catch (err) {
    onError("Cannot reach backend. Make sure the Express server is running on port 5000.");
  }
}
