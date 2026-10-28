const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "freeai-conversations-v1";
const ACTIVE_KEY = "freeai-active-v1";
let conversations = loadConversations();
let activeId = localStorage.getItem(ACTIVE_KEY);
let busy = false;
let abortController = null;

function loadConversations() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data.filter((c) => c && c.id && Array.isArray(c.messages)) : [];
  } catch { return []; }
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, 40)));
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
  } catch { showToast("This device is low on storage. Some history may not save."); }
}
function activeChat() { return conversations.find((c) => c.id === activeId); }
function newChat() {
  if (busy) return;
  const chat = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), title: "New chat", messages: [], updatedAt: Date.now() };
  conversations.unshift(chat);
  activeId = chat.id;
  persist();
  render();
  $("prompt").focus();
  closeSidebarOnMobile();
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function formatText(value) {
  let text = escapeHTML(value);
  text = text.replace(/```([\w+-]*)\n?([\s\S]*?)```/g, (_, lang, code) => `<pre><div class="code-head">${escapeHTML(lang || "code")}<button class="copy-code">Copy</button></div><code>${code.trimEnd()}</code></pre>`);
  text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/^(#{1,3})\s+(.+)$/gm, (_, hashes, heading) => `<h${Math.min(4, hashes.length + 1)}>${heading}</h${Math.min(4, hashes.length + 1)}>`);
  text = text.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
  text = text.replace(/(?:<li>.*<\/li>\n?)+/gs, (list) => "<ul>" + list + "</ul>");
  return text.split(/\n{2,}/).map((part) => /^(<h[2-4]>|<pre>|<ul>)/.test(part) ? part : part.replace(/\n/g, "<br>")).join("\n");
}
function render() {
  const chat = activeChat();
  $("welcome").hidden = !!(chat && chat.messages.length);
  $("messages").innerHTML = "";
  if (chat) {
    chat.messages.forEach((message, index) => {
      const item = document.createElement("article");
      item.className = "message " + message.role;
      const avatar = document.createElement("div");
      avatar.className = "message-avatar " + (message.role === "assistant" ? "ai-avatar" : "user-avatar");
      avatar.textContent = message.role === "assistant" ? "✳" : "Y";
      const content = document.createElement("div");
      content.className = "message-body";
      const author = document.createElement("div");
      author.className = "message-author";
      author.textContent = message.role === "assistant" ? "FreeAI" : "You";
      const text = document.createElement("div");
      text.className = "message-content";
      text.innerHTML = formatText(message.content || "");
      content.append(author, text);
      item.append(avatar, content);
      if (message.role === "assistant" && index === chat.messages.length - 1 && busy) {
        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        text.append(cursor);
      }
      $("messages").append(item);
    });
  }
  $("history").innerHTML = "";
  conversations.slice(0, 30).forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-row" + (item.id === activeId ? " active" : "");
    const open = document.createElement("button");
    open.className = "history-item";
    open.textContent = item.title || "New chat";
    open.title = item.title || "New chat";
    open.addEventListener("click", () => { if (busy) return; activeId = item.id; persist(); render(); closeSidebarOnMobile(); });
    const remove = document.createElement("button");
    remove.className = "history-delete";
    remove.textContent = "×";
    remove.title = "Delete conversation";
    remove.setAttribute("aria-label", "Delete " + (item.title || "conversation"));
    remove.addEventListener("click", () => {
      if (busy) return;
      conversations = conversations.filter((c) => c.id !== item.id);
      if (activeId === item.id) activeId = conversations[0]?.id || null;
      persist(); render();
    });
    row.append(open, remove);
    $("history").append(row);
  });
  $("conversation").scrollTop = $("conversation").scrollHeight;
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 4200);
}
function setBusy(value) {
  busy = value;
  $("send-button").textContent = value ? "■" : "↑";
  $("send-button").setAttribute("aria-label", value ? "Stop generating" : "Send message");
  $("prompt").disabled = value;
}
function closeSidebarOnMobile() { if (matchMedia("(max-width: 760px)").matches) $("sidebar").classList.remove("open"); }
async function sendMessage(raw) {
  const content = raw.trim();
  if (!content || busy) return;
  if (!activeChat()) {
    const chat = { id: String(Date.now()), title: "New chat", messages: [], updatedAt: Date.now() };
    conversations.unshift(chat); activeId = chat.id;
  }
  const chat = activeChat();
  chat.messages.push({ role: "user", content });
  if (chat.messages.length === 1) chat.title = content.length > 36 ? content.slice(0, 36).trim() + "…" : content;
  chat.updatedAt = Date.now();
  const assistant = { role: "assistant", content: "" };
  chat.messages.push(assistant);
  persist(); setBusy(true); render();
  abortController = new AbortController();
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chat.messages.slice(0, -1).slice(-24) }),
      signal: abortController.signal
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "The request failed. Please try again.");
    }
    if (!response.body) throw new Error("Streaming is not supported by this browser.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const data = JSON.parse(payload);
          assistant.content += data.choices?.[0]?.delta?.content || "";
        } catch {}
      }
      render();
      if (done) break;
    }
    if (!assistant.content.trim()) assistant.content = "The model returned an empty response. Please try again.";
  } catch (error) {
    if (error.name === "AbortError") {
      if (!assistant.content.trim()) chat.messages.pop();
      else assistant.content += "\n\n*Generation stopped.*";
    } else {
      chat.messages.pop();
      chat.messages.push({ role: "assistant", content: "I couldn't get a response. " + error.message });
    }
  } finally {
    abortController = null;
    setBusy(false);
    chat.updatedAt = Date.now();
    persist(); render(); $("prompt").value = ""; updateCount(); $("prompt").focus();
  }
}
function updateCount() { $("char-count").textContent = $("prompt").value.length.toLocaleString() + " / 12000"; }
$("chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (busy) { abortController?.abort(); return; }
  const value = $("prompt").value;
  $("prompt").value = "";
  updateCount();
  sendMessage(value);
});
$("prompt").addEventListener("input", () => {
  updateCount();
  $("prompt").style.height = "auto";
  $("prompt").style.height = Math.min($("prompt").scrollHeight, 200) + "px";
});
$("prompt").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); $("chat-form").requestSubmit(); }
});
$("new-chat").addEventListener("click", newChat);
$("new-chat-top").addEventListener("click", newChat);
$("clear-history").addEventListener("click", () => {
  if (busy) return;
  if (!confirm("Delete all conversations saved on this device? This cannot be undone.")) return;
  conversations = []; activeId = null;
  localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(ACTIVE_KEY); render();
});
$("menu-toggle").addEventListener("click", () => $("sidebar").classList.toggle("open"));
document.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => {
  $("prompt").value = button.dataset.prompt || "";
  updateCount(); $("prompt").focus(); $("prompt").style.height = "auto"; $("prompt").style.height = $("prompt").scrollHeight + "px";
}));
$("messages").addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-code");
  if (!button) return;
  const code = button.closest("pre")?.querySelector("code")?.textContent || "";
  try { await navigator.clipboard.writeText(code); button.textContent = "Copied"; setTimeout(() => button.textContent = "Copy", 1500); }
  catch { showToast("Clipboard access is unavailable in this browser."); }
});
render();
