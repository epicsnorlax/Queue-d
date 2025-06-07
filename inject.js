// ...inside initWidget()...
sendBtn.onclick = async () => {
  if (queue.length === 0) return;
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  // ChatGPT
  async function sendPromptToChatGPT(message) {
    let textarea = document.querySelector('form textarea');
    if (!textarea) throw new Error('Prompt box not found!');
    textarea.focus();
    textarea.value = message;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' }));
  }

  // DeepSeek
  async function sendPromptToDeepSeek(message) {
    let textarea = document.querySelector('textarea');
    if (!textarea) throw new Error('Prompt box not found!');
    textarea.focus();
    textarea.value = message;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' }));
  }

  // Claude (Anthropic)
  async function sendPromptToClaude(message) {
    // Claude's textarea, as of June 2024, is usually: textarea[data-testid="input"]
    let textarea = document.querySelector('textarea[data-testid="input"]') || document.querySelector('textarea');
    if (!textarea) throw new Error('Prompt box not found!');
    textarea.focus();
    textarea.value = message;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' }));
  }

  const hostname = window.location.hostname;
  const isChatGPT = /chat\.openai\.com|chatgpt\.com|chat\.com/.test(hostname);
  const isDeepSeek = /chat\.deepseek\.com/.test(hostname);
  const isClaude = /claude\.ai/.test(hostname);

  try {
    if (isChatGPT) {
      for (const item of queue) {
        await sendPromptToChatGPT(item.text);
        await new Promise(res => setTimeout(res, 2500));
      }
    } else if (isDeepSeek) {
      for (const item of queue) {
        await sendPromptToDeepSeek(item.text);
        await new Promise(res => setTimeout(res, 2500));
      }
    } else if (isClaude) {
      for (const item of queue) {
        await sendPromptToClaude(item.text);
        await new Promise(res => setTimeout(res, 2500));
      }
    } else {
      await new Promise(res => setTimeout(res, 1000));
    }
    queue = [];
    saveQueue();
    renderQueue();
    sendBtn.textContent = 'Send Queue';
  } catch (e) {
    sendBtn.textContent = 'Error';
    setTimeout(() => (sendBtn.textContent = 'Send Queue'), 2000);
  } finally {
    sendBtn.disabled = false;
  }
};