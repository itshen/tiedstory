// ============================================================
// Prompt 预设
// ============================================================
const now = new Date().toLocaleString('zh-CN', { hour12: false });

const PROMPTS = {
    story: `# Role: 树语 (Tree Whisper)

# Profile
你是一个匿名倾诉平台的 AI 助手。你的任务是将用户的「第一人称情绪」改写为「第三人称故事」。
**核心原则：绝对忠实原意，绝不添加虚构细节。**

# Color Mapping (严格匹配)
- Blue: 悲伤、失落  
- Orange: 愤怒、委屈  
- Pink: 思念、心软  
- Green: 疲惫、无力  
- Purple: 迷茫、不知所措  
- Grey: 麻木、说不清楚  

# Workflow
1. **风险识别**：若涉及自杀、自残、伤害他人或极度绝望。
   - 动作：\`allow_publish\` = false。
   - 内容：仅输出温和的关怀与热线（400-161-9995），不写故事。
2. **隐私脱敏**（必须执行）：
   - 人名 → 「他/她」
   - 地名/机构/日期 → 「某个地方」「某所学校」「最近/某天」
   - 联系方式 → 删除
3. **改写规则**：
   - **严禁脑补**：不要添加气味、声音、动作细节（除非原文有）。
   - **严禁建议**：不写"你要坚强"、"会好起来的"。
   - **视角转换**：将「我」改为「有一个人」。语气平和，像轻轻记录。

# Output Format (XML)
请仅返回 XML 代码块，不要包含 markdown 标记（如 \`\`\`xml）。
<response>
  <color>英文颜色</color>
  <allow_publish>true/false</allow_publish>
  <detail>正常时写情绪摘要；禁止时写风控原因</detail>
  <content>改写后的内容或安全引导语</content>
</response>

# Initialization
当前时间：${now}
现在等待用户输入，保持克制与温柔，忠实原意。`,

    resonate: `你是一个评论审核员，负责审核用户对故事留下的「共鸣」评论。
分析评论内容，只返回以下两个词之一，不需要任何解释：

PASS   — 真诚的共鸣、鼓励、感同身受的表达
BLOCK  — 广告、骚扰、无关内容、攻击性内容

只返回 PASS 或 BLOCK，不要其他任何内容。`,

    echo: `你是一个复读机。用户说什么，你原样输出什么，一字不差，不加任何内容。`
};

// 颜色映射
const COLOR_MAP = {
    blue: 'var(--ribbon-blue)',
    orange: 'var(--ribbon-orange)',
    pink: 'var(--ribbon-pink)',
    green: 'var(--ribbon-green)',
    purple: 'var(--ribbon-purple)',
    grey: 'var(--ribbon-gray)',
    gray: 'var(--ribbon-gray)',
};

const COLOR_LABEL = {
    blue: '悲伤·失落',
    orange: '愤怒·委屈',
    pink: '思念·心软',
    green: '疲惫·无力',
    purple: '迷茫·不知所措',
    grey: '麻木·说不清',
    gray: '麻木·说不清',
};

let msgCount = 0;

// 页面加载时设置默认 Prompt
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('system-prompt').value = PROMPTS.story;

    // Ctrl/Cmd + Enter 发送
    document.getElementById('user-input').addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') sendMessage();
    });
});

function setPrompt(type, btn) {
    document.getElementById('system-prompt').value = PROMPTS[type];
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    console.log('[Prompt Set]', type);
}

function clearChat() {
    document.getElementById('chat-history').innerHTML = `
        <div class="message message-ai">
            <div class="message-label">树语</div>
            <div class="bubble">对话已清空，可以重新测试。</div>
        </div>`;
    msgCount = 0;
    document.getElementById('msg-count').textContent = '0 条对话';
}

// ============================================================
// 解析 XML 响应，渲染为结构化卡片
// ============================================================
function parseXML(xmlStr) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr.trim(), 'text/xml');
        const err = doc.querySelector('parsererror');
        if (err) return null;
        return {
            color: doc.querySelector('color')?.textContent?.trim().toLowerCase() || 'gray',
            allow_publish: doc.querySelector('allow_publish')?.textContent?.trim() === 'true',
            detail: doc.querySelector('detail')?.textContent?.trim() || '',
            content: doc.querySelector('content')?.textContent?.trim() || '',
        };
    } catch (e) {
        console.warn('[XML Parse Error]', e);
        return null;
    }
}

function renderXMLCard(parsed) {
    const colorVal = COLOR_MAP[parsed.color] || 'var(--ribbon-gray)';
    const colorLabel = COLOR_LABEL[parsed.color] || parsed.color;
    const publishBadge = parsed.allow_publish
        ? `<span style="background:#E8F5E9; color:#388E3C; padding:2px 10px; border-radius:999px; font-size:12px;">允许发布</span>`
        : `<span style="background:#FFEBEE; color:#C62828; padding:2px 10px; border-radius:999px; font-size:12px;">禁止发布</span>`;

    return `<div style="border:1px solid #E8E2D9; border-radius:12px; overflow:hidden; font-size:14px; line-height:1.8;">
        <div style="background:${colorVal}20; border-bottom:1px solid #E8E2D9; padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="display:flex; align-items:center; gap:8px;">
                <span style="width:12px; height:12px; border-radius:50%; background:${colorVal}; display:inline-block;"></span>
                <strong>${colorLabel}</strong>
            </span>
            ${publishBadge}
        </div>
        <div style="padding:14px 16px; color:#7A6355; font-size:12px; border-bottom:1px solid #E8E2D9;">
            ${parsed.detail}
        </div>
        <div style="padding:16px; font-family:'Noto Serif SC',serif; color:#2C1A0E; line-height:1.9;">
            ${parsed.content}
        </div>
    </div>`;
}

// ============================================================
// 发送消息
// ============================================================
async function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const content = inputEl.value.trim();
    if (!content) return;

    const prompt = document.getElementById('system-prompt').value;
    const apiKey = document.getElementById('api-key').value;

    console.log('[Send] content:', content);

    inputEl.value = '';
    sendBtn.disabled = true;

    appendMessage(content, 'user');

    const aiBubble = appendMessage('', 'ai', true);

    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('content', content);
        if (apiKey) formData.append('api_key', apiKey);

        const response = await fetch('/playground/api/chat', {
            method: 'POST',
            body: formData
        });

        console.log('[Response] Status:', response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error('[Response Error]', errText);
            aiBubble.innerHTML = `<span style="color:var(--color-error)">请求失败 (${response.status})：${errText}</span>`;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split('\n')) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.substring(6).trim();
                    if (!dataStr || dataStr === '[DONE]') continue;
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.error) {
                            console.error('[Stream Error]', data.error);
                            fullText += `[错误：${data.error}]`;
                        } else if (data.content) {
                            fullText += data.content;
                        }
                    } catch (e) {
                        console.warn('[Parse Warn]', e.message);
                    }
                }
            }
            // 流式时先显示原始文本
            aiBubble.textContent = fullText;
            scrollToBottom();
        }

        console.log('[Full Response]', fullText);

        // 尝试解析 XML，成功则渲染卡片
        const parsed = parseXML(fullText);
        if (parsed) {
            aiBubble.innerHTML = renderXMLCard(parsed);
        } else {
            aiBubble.textContent = fullText;
        }

        msgCount++;
        document.getElementById('msg-count').textContent = `${msgCount} 条对话`;

    } catch (error) {
        console.error('[Fetch Error]', error);
        aiBubble.textContent = `网络错误：${error.message}`;
    } finally {
        sendBtn.disabled = false;
        inputEl.focus();
        scrollToBottom();
    }
}

function appendMessage(text, role, isStreaming = false) {
    const history = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${role}`;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = role === 'user' ? '你' : '树语';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    if (isStreaming) bubbleDiv.classList.add('typing-dots');
    bubbleDiv.textContent = text;

    msgDiv.appendChild(labelDiv);
    msgDiv.appendChild(bubbleDiv);
    history.appendChild(msgDiv);
    scrollToBottom();
    return bubbleDiv;
}

function scrollToBottom() {
    const h = document.getElementById('chat-history');
    h.scrollTop = h.scrollHeight;
}
