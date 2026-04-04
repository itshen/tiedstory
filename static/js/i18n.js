/**
 * TiedStory 多语言国际化
 * 支持：zh-CN（简中）、zh-TW（繁中）、en、ja、ko、fr、ru
 */

// 主题专题翻译（供 about.html / topics.html 等页面使用）
const TOPIC_I18N = {
  'zh-CN': {
    loss: '失恋难过', lonely: '孤独无助', anxiety: '焦虑压力', work: '工作委屈',
    family: '家庭烦恼', confused: '迷茫困惑', tired: '身心疲惫', miss: '思念某人',
    sad: '莫名想倾诉', angry: '委屈愤怒', numb: '麻木空洞', hope: '期待感恩'
  },
  'zh-TW': {
    loss: '失戀難過', lonely: '孤獨無助', anxiety: '焦慮壓力', work: '工作委屈',
    family: '家庭煩惱', confused: '迷茫困惑', tired: '身心疲憊', miss: '思念某人',
    sad: '莫名想傾訴', angry: '委屈憤怒', numb: '麻木空洞', hope: '期待感恩'
  },
  'en': {
    loss: 'Heartbreak', lonely: 'Loneliness', anxiety: 'Anxiety', work: 'Work Stress',
    family: 'Family Issues', confused: 'Confused', tired: 'Exhausted', miss: 'Missing Someone',
    sad: 'Need to Talk', angry: 'Anger & Grievance', numb: 'Numb & Empty', hope: 'Joy & Gratitude'
  },
  'ja': {
    loss: '失恋・悲しみ', lonely: '孤独', anxiety: '不安・ストレス', work: '職場の不満',
    family: '家族の悩み', confused: '迷い・困惑', tired: '疲労・倦怠', miss: '人を想う',
    sad: '話したい', angry: '怒り・悔しさ', numb: '無感覚・虚無', hope: '喜び・感謝'
  },
  'ko': {
    loss: '이별 슬픔', lonely: '외로움', anxiety: '불안 스트레스', work: '직장 고충',
    family: '가족 고민', confused: '방황 혼란', tired: '피로 권태', miss: '그리움',
    sad: '토로하고 싶음', angry: '분노 억울함', numb: '무감각 공허', hope: '기쁨 감사'
  },
  'fr': {
    loss: 'Peine de cœur', lonely: 'Solitude', anxiety: 'Anxiété', work: 'Stress au travail',
    family: 'Problèmes familiaux', confused: 'Confusion', tired: 'Épuisement', miss: 'Manque de quelqu\'un',
    sad: 'Besoin de parler', angry: 'Colère & Rancœur', numb: 'Engourdissement', hope: 'Joie & Gratitude'
  },
  'ru': {
    loss: 'Боль расставания', lonely: 'Одиночество', anxiety: 'Тревога', work: 'Рабочий стресс',
    family: 'Семейные проблемы', confused: 'Растерянность', tired: 'Усталость', miss: 'Скучаю по кому-то',
    sad: 'Нужно выговориться', angry: 'Гнев и обида', numb: 'Оцепенение', hope: 'Радость и благодарность'
  }
};

// about.html 页面专用翻译
const ABOUT_PAGE_I18N = {
  'zh-CN': {
    heroTitle: '说出来就好<br>这里不会有人知道是你',
    heroDesc: '不需要注册，不需要账号，没有任何记录能追溯到你。<br>只是写下来——我们都在这里。',
    heroBtn: '系一条丝带',
    statRibbons: '条心声', statEchoes: '次回响', statAnytime: '随时倾诉',
    ctaTitle: '准备好了吗？', ctaDesc: '把那句憋在心里的话，写下来吧。没有账号，没有记录。', ctaBtn: '进入树洞，系一条丝带'
  },
  'zh-TW': {
    heroTitle: '說出來就好<br>這裡不會有人知道是你',
    heroDesc: '不需要註冊，不需要帳號，沒有任何記錄能追溯到你。<br>只是寫下來——我們都在這裡。',
    heroBtn: '繫一條絲帶',
    statRibbons: '條心聲', statEchoes: '次回響', statAnytime: '隨時傾訴',
    ctaTitle: '準備好了嗎？', ctaDesc: '把那句憋在心裡的話，寫下來吧。沒有帳號，沒有記錄。', ctaBtn: '進入樹洞，繫一條絲帶'
  },
  'en': {
    heroTitle: 'Just say it.<br>No one here will know it\'s you.',
    heroDesc: 'No registration. No account. No traces leading to you.<br>Just write it down — we\'re here.',
    heroBtn: 'Tie a Ribbon',
    statRibbons: 'stories', statEchoes: 'echoes', statAnytime: 'available anytime',
    ctaTitle: 'Ready?', ctaDesc: 'Write down the words you\'ve been holding back. No account. No trace.', ctaBtn: 'Enter the Tree'
  },
  'ja': {
    heroTitle: '言えばいい<br>ここにいる誰もあなただとは分からない',
    heroDesc: '登録不要、アカウント不要、あなたをたどる記録もない。<br>ただ書けばいい——私たちはここにいる。',
    heroBtn: 'リボンを結ぶ',
    statRibbons: 'つのストーリー', statEchoes: 'つの共鳴', statAnytime: 'いつでも話せる',
    ctaTitle: '準備はいいですか？', ctaDesc: '心にしまっておいた言葉を書きましょう。アカウントも記録もありません。', ctaBtn: '樹に入る'
  },
  'ko': {
    heroTitle: '말하면 돼<br>여기선 아무도 당신인 줄 모릅니다',
    heroDesc: '가입 없이, 계정 없이, 당신을 추적할 기록도 없이.<br>그냥 적으세요——우리는 여기 있습니다.',
    heroBtn: '리본 묶기',
    statRibbons: '개의 이야기', statEchoes: '번의 공명', statAnytime: '언제든 털어놓을 수 있어요',
    ctaTitle: '준비됐나요?', ctaDesc: '마음속에 담아뒀던 말을 적어보세요. 계정도 기록도 없습니다.', ctaBtn: '나무로 들어가기'
  },
  'fr': {
    heroTitle: 'Dis-le.<br>Personne ici ne saura que c\'est toi.',
    heroDesc: 'Pas d\'inscription. Pas de compte. Aucune trace menant à toi.<br>Écris simplement — nous sommes là.',
    heroBtn: 'Nouer un ruban',
    statRibbons: 'histoires', statEchoes: 'échos', statAnytime: 'disponible à tout moment',
    ctaTitle: 'Prêt(e) ?', ctaDesc: 'Écris la phrase que tu gardes au fond de toi. Sans compte, sans trace.', ctaBtn: 'Entrer dans l\'arbre'
  },
  'ru': {
    heroTitle: 'Просто скажи.<br>Никто здесь не узнает, что это ты.',
    heroDesc: 'Без регистрации. Без аккаунта. Без следов, ведущих к тебе.<br>Просто напиши — мы рядом.',
    heroBtn: 'Завязать ленту',
    statRibbons: 'историй', statEchoes: 'откликов', statAnytime: 'можно выговориться в любой момент',
    ctaTitle: 'Готов(а)?', ctaDesc: 'Запиши ту самую фразу, которую давно держишь внутри. Без аккаунта. Без следов.', ctaBtn: 'Войти в дерево'
  }
};

/**
 * 获取专题翻译
 */
function getTopicI18n(slug, lang) {
  const t = TOPIC_I18N[lang] || TOPIC_I18N['zh-CN'];
  return t[slug] || slug;
}

/**
 * 获取 about 页面翻译
 */
function getAboutI18n(lang) {
  return ABOUT_PAGE_I18N[lang] || ABOUT_PAGE_I18N['zh-CN'];
}

/**
 * 初始化 i18n（供各页面调用）
 */
function i18nInit() {
  i18nApply();
  i18nRenderSwitcher();
}

const I18N_LANGS = {
  'zh-CN': {
    flag: '🇨🇳', label: '简体中文', dir: 'ltr',
    t: {
      // 时段
      morning: '清晨', noon: '正午', dusk: '傍晚', night: '夜晚',
      // 季节
      spring: '春', summer: '夏', autumn: '秋', winter: '冬',
      // 品牌
      slogan: '每一条丝带，都是你认真生活的证明',
      // 操作栏
      ribbon_count: (n) => `共 ${n} 条丝带`,
      shuffle: '随机遇见',
      view_all: '查看全部',
      collapse: '收起',
      // 颜色筛选
      filter_all: '全部',
      color_orange: '愤怒 · 委屈',
      color_blue: '悲伤 · 失落',
      color_pink: '温柔 · 思念',
      color_green: '疲惫 · 倦怠',
      color_purple: '迷茫 · 困惑',
      color_gray: '麻木 · 空洞',
      color_gold: '喜悦 · 感恩',
      // 浮动按钮
      my_ribbons: '我的丝带',
      witness_placeholder: '输入见证码…',
      tie_btn: '系上一条',
      witness_btn: '凭码查看',
      // 发布弹窗
      tie_title: '此刻，你想说什么？',
      tie_subtitle: '写下来就好，不需要理由，也不用完整',
      tie_placeholder: '今天，我……',
      tie_ready: '我准备好了',
      tie_sensing: '正在感知你的情绪',
      tie_btn_submit: '系上这条丝带',
      tie_done_title: '丝带已系上树了',
      tie_done_subtitle: '保存这串见证码，随时凭它查看别人的回应',
      tie_witness_hint: '它是你与这条故事之间唯一的连接',
      tie_saved_hint: '已自动保存到<strong>本机浏览器</strong>。换浏览器或清除记录后会消失。如需长期保管，推荐存到 WPS 笔记。',
      tie_confirm: '好，我记下了',
      // 危机提示
      crisis_text: '或者联系',
      crisis_link: '生命热线',
      // 丝带详情
      resonance_count: (n) => `回响 · ${n}`,
      resonance_placeholder: '写下你的回响（50字以内）…',
      resonance_submit: '留下回响',
      author_append_label: (t) => `作者追加 · ${t}`,
      witness_input_placeholder: '输入你的见证码',
      witness_verify: '验证',
      witness_hint: '见证码是发布时生成的 12 位私密码，只有你知道',
      witness_error: '见证码不正确，请重试',
      append_placeholder: '追加你想说的……（后续感受、新进展都可以）',
      append_submit: '追加到丝带上',
      moderation_blocked: '内容包含敏感信息，已阻止发送。',
      share_link: '复制分享链接',
      share_copied: '已复制',
      author_toggle: '我是这条丝带的作者，想追加内容',
      crisis_title: '我们注意到一些让你痛苦的字句',
      crisis_body_html: '你现在的感受很重要。如果此刻非常难受，可以拨打心理援助热线 <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong>，或者联系 <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">生命热线</a>，那里有人愿意听你说。<br><br>这条丝带暂时无法系上，但你不是一个人。',
      rewrite: '重新写',
      wps_save: '存到 WPS 笔记，永久保管',
      wps_archive: '前往 WPS 笔记永久保管',
      welcome_story_html: '有一个人，今天终于把那句憋了很久的话，写了下来。<br><br>不是给任何人看的，只是写下来。<br><br>写完之后，她把它挂在了这里。轻了一些，也好了一点点。',
      welcome_desc_html: '这里是 <strong>TiedStory</strong>。<br>不用注册，不用解释，也不用担心被认出来。<br><br>你只需要把心里的那句话，系成一条丝带。<br>它会留在树上，被风吹动，也可能被某个陌生人温柔地看见。',
      loading_failed: '加载失败，请重试。',
      witness_entered: '已输入',
      checking: '检测中…',
      submitting: '提交中…',
      // 我的丝带
      my_ribbons_title: '我的丝带',
      my_ribbons_hint: '以下记录保存在<strong style="color:rgba(200,155,80,0.6);">本机浏览器</strong>。换浏览器或清除记录后会消失。<br>如需长期保管，推荐存到 WPS 笔记。',
      my_ribbons_empty: '还没有系上过任何丝带',
      // 欢迎语
      welcome_eyebrow: '有一条金色的丝带，就挂在这棵树上',
      // 空状态
      no_ribbons: '还没有人系上丝带，成为第一个吧。',
      // 时间
      just_now: '刚刚',
      minutes_ago: (n) => `${n} 分钟前`,
      hours_ago: (n) => `${n} 小时前`,
      days_ago: (n) => `${n} 天前`,
      months_ago: (n) => `${n} 个月前`,
      years_ago: (n) => `${n} 年前`,
      // AI 标签
      ai_label: '树语',
      // 今日访客
      visitors_today: (n) => `${n} 人在线`,
      // 导航（about 页）
      nav_back: '回到树洞',
      nav_topics: '情绪专题',
      nav_faq: '常见问题',
      nav_about: '关于我们',
      // Playground 背景模式
      pg_real_mode: '跟随真实时间',
      pg_demo_mode: '时光流逝演示（30s/时段）',
      pg_auto_hint: '按真实月份季节、真实时刻自动切换',
      pg_demo_hint: '演示中：每30秒流转一个时段，转完四个进入下一季节',
    }
  },

  'zh-TW': {
    flag: '🇨🇳', label: '繁體中文', dir: 'ltr',
    t: {
      morning: '清晨', noon: '正午', dusk: '傍晚', night: '夜晚',
      spring: '春', summer: '夏', autumn: '秋', winter: '冬',
      slogan: '每一條絲帶，都是你認真生活的證明',
      ribbon_count: (n) => `共 ${n} 條絲帶`,
      shuffle: '隨機遇見',
      view_all: '查看全部',
      collapse: '收起',
      filter_all: '全部',
      color_orange: '憤怒 · 委屈',
      color_blue: '悲傷 · 失落',
      color_pink: '溫柔 · 思念',
      color_green: '疲憊 · 倦怠',
      color_purple: '迷茫 · 困惑',
      color_gray: '麻木 · 空洞',
      color_gold: '喜悅 · 感恩',
      my_ribbons: '我的絲帶',
      witness_placeholder: '輸入見證碼…',
      tie_btn: '繫上一條',
      witness_btn: '憑碼查看',
      tie_title: '此刻，你想說什麼？',
      tie_subtitle: '寫下來就好，不需要理由，也不用完整',
      tie_placeholder: '今天，我……',
      tie_ready: '我準備好了',
      tie_sensing: '正在感知你的情緒',
      tie_btn_submit: '繫上這條絲帶',
      tie_done_title: '絲帶已繫上樹了',
      tie_done_subtitle: '保存這串見證碼，隨時憑它查看別人的回應',
      tie_witness_hint: '它是你與這條故事之間唯一的連接',
      tie_saved_hint: '已自動儲存到<strong>本機瀏覽器</strong>。換瀏覽器或清除記錄後會消失。如需長期保管，推薦存到 WPS 筆記。',
      tie_confirm: '好，我記下了',
      crisis_text: '或者聯繫',
      crisis_link: '生命熱線',
      share_link: '複製分享連結',
      share_copied: '已複製',
      author_toggle: '我是這條絲帶的作者，想追加內容',
      crisis_title: '我們注意到一些讓你痛苦的字句',
      crisis_body_html: '你現在的感受很重要。如果此刻非常難受，可以撥打心理援助熱線 <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong>，或者聯繫 <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">生命熱線</a>，那裡有人願意聽你說。<br><br>這條絲帶暫時無法繫上，但你不是一個人。',
      rewrite: '重新寫',
      wps_save: '存到 WPS 筆記，永久保管',
      wps_archive: '前往 WPS 筆記永久保管',
      welcome_story_html: '有一個人，今天終於把那句憋了很久的話，寫了下來。<br><br>不是給任何人看的，只是寫下來。<br><br>寫完之後，她把它掛在了這裡。輕了一些，也好了一點點。',
      welcome_desc_html: '這裡是 <strong>TiedStory</strong>。<br>不用註冊，不用解釋，也不用擔心被認出來。<br><br>你只需要把心裡的那句話，繫成一條絲帶。<br>它會留在樹上，被風吹動，也可能被某個陌生人溫柔地看見。',
      loading_failed: '載入失敗，請重試。',
      witness_entered: '已輸入',
      checking: '檢測中…',
      submitting: '提交中…',
      resonance_count: (n) => `回響 · ${n}`,
      resonance_placeholder: '寫下你的回響（50字以內）…',
      resonance_submit: '留下回響',
      author_append_label: (t) => `作者追加 · ${t}`,
      witness_input_placeholder: '輸入你的見證碼',
      witness_verify: '驗證',
      witness_hint: '見證碼是發布時生成的 12 位私密碼，只有你知道',
      witness_error: '見證碼不正確，請重試',
      append_placeholder: '追加你想說的……（後續感受、新進展都可以）',
      append_submit: '追加到絲帶上',
      moderation_blocked: '內容包含敏感資訊，已阻止發送。',
      my_ribbons_title: '我的絲帶',
      my_ribbons_hint: '以下記錄儲存在<strong style="color:rgba(200,155,80,0.6);">本機瀏覽器</strong>。換瀏覽器或清除記錄後會消失。<br>如需長期保管，推薦存到 WPS 筆記。',
      my_ribbons_empty: '還沒有繫上過任何絲帶',
      welcome_eyebrow: '有一條金色的絲帶，就掛在這棵樹上',
      no_ribbons: '還沒有人繫上絲帶，成為第一個吧。',
      just_now: '剛剛',
      minutes_ago: (n) => `${n} 分鐘前`,
      hours_ago: (n) => `${n} 小時前`,
      days_ago: (n) => `${n} 天前`,
      months_ago: (n) => `${n} 個月前`,
      years_ago: (n) => `${n} 年前`,
      ai_label: '樹語',
      visitors_today: (n) => `${n} 人在線`,
      nav_back: '回到樹洞',
      nav_topics: '情緒專題',
      nav_faq: '常見問題',
      nav_about: '關於我們',
      pg_real_mode: '跟隨真實時間',
      pg_demo_mode: '時光流逝演示（30s/時段）',
      pg_auto_hint: '按真實月份季節、真實時刻自動切換',
      pg_demo_hint: '演示中：每30秒流轉一個時段，轉完四個進入下一季節',
    }
  },

  'en': {
    flag: '🇬🇧', label: 'English', dir: 'ltr',
    t: {
      morning: 'Morning', noon: 'Noon', dusk: 'Dusk', night: 'Night',
      spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
      slogan: 'Every ribbon is proof that you are living earnestly.',
      ribbon_count: (n) => `${n} ribbons`,
      shuffle: 'Discover',
      view_all: 'View all',
      collapse: 'Collapse',
      filter_all: 'All',
      color_orange: 'Anger · Grievance',
      color_blue: 'Sadness · Loss',
      color_pink: 'Longing · Tenderness',
      color_green: 'Exhaustion · Fatigue',
      color_purple: 'Confusion · Uncertainty',
      color_gray: 'Numbness · Emptiness',
      color_gold: 'Joy · Gratitude',
      my_ribbons: 'My ribbons',
      witness_placeholder: 'Enter witness code…',
      tie_btn: 'Tie a ribbon',
      witness_btn: 'Find by code',
      tie_title: 'What do you want to say?',
      tie_subtitle: 'Just write it down. No reason needed, no need to be complete.',
      tie_placeholder: 'Today, I…',
      tie_ready: "I'm ready",
      tie_sensing: 'Sensing your emotions…',
      tie_btn_submit: 'Tie this ribbon',
      tie_done_title: 'Your ribbon is on the tree',
      tie_done_subtitle: 'Save this witness code to check responses anytime.',
      tie_witness_hint: 'This is the only link between you and your story.',
      tie_saved_hint: 'Auto-saved to <strong>this browser</strong>. Will be lost if you switch browsers or clear data.',
      tie_confirm: 'Got it',
      crisis_text: 'or contact',
      crisis_link: 'crisis line',
      resonance_count: (n) => `Echoes · ${n}`,
      resonance_placeholder: 'Leave your echo (under 50 words)…',
      resonance_submit: 'Leave an echo',
      author_append_label: (t) => `Author added · ${t}`,
      witness_input_placeholder: 'Enter your witness code',
      witness_verify: 'Verify',
      witness_hint: 'The 12-digit code generated when you posted — only you know it.',
      witness_error: 'Incorrect witness code. Please try again.',
      append_placeholder: 'Add a follow-up… (how you feel now, any new updates)',
      append_submit: 'Append to ribbon',
      moderation_blocked: 'Content flagged. Message not sent.',
      my_ribbons_title: 'My Ribbons',
      my_ribbons_hint: 'Records are saved in <strong style="color:rgba(200,155,80,0.6);">this browser</strong>. They will be lost if you switch browsers or clear data.<br>For long-term safekeeping, save them to WPS Notes.',
      my_ribbons_empty: "You haven't tied any ribbons yet.",
      welcome_eyebrow: 'A golden ribbon hangs on this tree',
      no_ribbons: "No ribbons yet — be the first.",
      just_now: 'just now',
      minutes_ago: (n) => `${n}m ago`,
      hours_ago: (n) => `${n}h ago`,
      days_ago: (n) => `${n}d ago`,
      months_ago: (n) => `${n}mo ago`,
      years_ago: (n) => `${n}y ago`,
      ai_label: 'TreeWhisper',
      visitors_today: (n) => `${n} online`,
      nav_back: 'Back to Tree',
      nav_topics: 'Topics',
      nav_faq: 'FAQ',
      nav_about: 'About',
      pg_real_mode: 'Follow real time',
      pg_demo_mode: 'Time-lapse demo (30s/period)',
      pg_auto_hint: 'Auto-switches by real season and time of day',
      pg_demo_hint: 'Demo: cycles through 4 periods every 30s, then moves to the next season',
      share_link: 'Copy share link',
      share_copied: 'Copied',
      author_toggle: 'I wrote this ribbon and want to add more',
      crisis_title: 'We noticed some painful words',
      crisis_body_html: 'Your feelings matter. If you are in distress, call the national psychological support hotline <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong>, or contact <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">crisis line</a>. Someone there will listen.<br><br>This ribbon cannot be posted right now, but you are not alone.',
      rewrite: 'Rewrite',
      wps_save: 'Save to WPS Notes',
      wps_archive: 'Open WPS Notes',
      welcome_story_html: 'Someone finally wrote down the words they had held inside for so long.<br><br>Not for anyone to read — just to write them.<br><br>Afterwards, they hung it here. It felt a little lighter.',
      welcome_desc_html: 'This is <strong>TiedStory</strong>.<br>No signup, no explanation, no fear of being recognized.<br><br>Turn what you carry into a ribbon.<br>It stays on the tree, moves with the wind, and may be gently seen by a stranger.',
      loading_failed: 'Failed to load. Please try again.',
      witness_entered: 'Entered',
      checking: 'Checking…',
      submitting: 'Submitting…',
    }
  },

  'ja': {
    flag: '🇯🇵', label: '日本語', dir: 'ltr',
    t: {
      morning: '朝', noon: '昼', dusk: '夕暮れ', night: '夜',
      spring: '春', summer: '夏', autumn: '秋', winter: '冬',
      slogan: 'すべてのリボンは、あなたが真剣に生きている証。',
      ribbon_count: (n) => `${n} 本のリボン`,
      shuffle: 'ランダムに出会う',
      view_all: 'すべて見る',
      collapse: '閉じる',
      filter_all: 'すべて',
      color_orange: '怒り · 悔しさ',
      color_blue: '悲しみ · 失望',
      color_pink: '思い · 優しさ',
      color_green: '疲れ · 倦怠',
      color_purple: '迷い · 戸惑い',
      color_gray: '虚無 · 感覚麻痺',
      color_gold: '喜び · 感謝',
      my_ribbons: 'マイリボン',
      witness_placeholder: '証言コードを入力…',
      tie_btn: 'リボンを結ぶ',
      witness_btn: 'コードで探す',
      tie_title: '今、何を言いたいですか？',
      tie_subtitle: '書くだけでいい。理由も、まとまりも要らない。',
      tie_placeholder: '今日、私は……',
      tie_ready: '準備できました',
      tie_sensing: 'あなたの気持ちを感じ取っています…',
      tie_btn_submit: 'このリボンを結ぶ',
      tie_done_title: 'リボンが木に結ばれました',
      tie_done_subtitle: '証言コードを保存して、いつでも返答を確認できます。',
      tie_witness_hint: 'これはあなたとこのストーリーを結ぶ唯一のつながりです。',
      tie_saved_hint: '<strong>このブラウザ</strong>に自動保存されました。ブラウザを変えるかデータを削除すると消えます。',
      tie_confirm: 'わかりました',
      crisis_text: 'または相談窓口へ',
      crisis_link: 'いのちの電話',
      resonance_count: (n) => `共鳴 · ${n}`,
      resonance_placeholder: '共鳴を残す（50文字以内）…',
      resonance_submit: '共鳴を残す',
      author_append_label: (t) => `著者が追記 · ${t}`,
      witness_input_placeholder: '証言コードを入力',
      witness_verify: '確認',
      witness_hint: '投稿時に生成された12桁の秘密コード。あなただけが知っています。',
      witness_error: '証言コードが正しくありません。再試行してください。',
      append_placeholder: '追記する……（その後の気持ちや新しい出来事など）',
      append_submit: 'リボンに追記する',
      moderation_blocked: '不適切なコンテンツが含まれています。送信がブロックされました。',
      my_ribbons_title: 'マイリボン',
      my_ribbons_hint: '記録は<strong style="color:rgba(200,155,80,0.6);">このブラウザ</strong>に保存されています。ブラウザを変えるかデータを削除すると消えます。<br>長期保存するなら WPS ノートへの保存をおすすめします。',
      my_ribbons_empty: 'まだリボンを結んでいません。',
      welcome_eyebrow: '金色のリボンが、この木に結ばれています',
      no_ribbons: 'まだリボンがありません。最初の一本を結んでみましょう。',
      just_now: 'たった今',
      minutes_ago: (n) => `${n}分前`,
      hours_ago: (n) => `${n}時間前`,
      days_ago: (n) => `${n}日前`,
      months_ago: (n) => `${n}ヶ月前`,
      years_ago: (n) => `${n}年前`,
      ai_label: 'ツリーウィスパー',
      visitors_today: (n) => `${n}人がオンライン`,
      nav_back: 'ツリーに戻る',
      nav_topics: 'トピック',
      nav_faq: 'よくある質問',
      nav_about: '私たちについて',
      pg_real_mode: '実時間に合わせる',
      pg_demo_mode: 'タイムラプスデモ（30秒/時間帯）',
      pg_auto_hint: '実際の季節・時刻に合わせて自動切替',
      pg_demo_hint: 'デモ中：30秒ごとに時間帯が変わり、4つ終わると次の季節へ',
      share_link: '共有リンクをコピー',
      share_copied: 'コピーしました',
      author_toggle: 'このリボンの作者で、追記したい',
      crisis_title: 'つらい言葉が含まれているようです',
      crisis_body_html: '今の気持ちは大切です。とても苦しいときは、全国心理援助ホットライン <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong>、または <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">いのちの電話</a> へ。話を聞いてくれる人がいます。<br><br>今はこのリボンを結べませんが、あなたはひとりではありません。',
      rewrite: '書き直す',
      wps_save: 'WPS ノートに保存',
      wps_archive: 'WPS ノートを開く',
      welcome_story_html: 'ある人が、ずっと胸にしまっていた言葉を、今日やっと書いた。<br><br>誰に見せるためではなく、ただ書くために。<br><br>書き終えて、ここに掛けた。少しだけ軽くなった。',
      welcome_desc_html: 'ここは <strong>TiedStory</strong>。<br>登録も説明も、バレる心配もいらない。<br><br>心の一言を、リボンにして結ぶだけ。<br>木に残り、風に揺れ、誰かの目に優しく触れるかもしれない。',
      loading_failed: '読み込みに失敗しました。もう一度お試しください。',
      witness_entered: '入力済み',
      checking: '確認中…',
      submitting: '送信中…',
    }
  },

  'ko': {
    flag: '🇰🇷', label: '한국어', dir: 'ltr',
    t: {
      morning: '아침', noon: '정오', dusk: '황혼', night: '밤',
      spring: '봄', summer: '여름', autumn: '가을', winter: '겨울',
      slogan: '모든 리본은 당신이 진지하게 살아가는 증거입니다.',
      ribbon_count: (n) => `리본 ${n}개`,
      shuffle: '무작위 만남',
      view_all: '전체 보기',
      collapse: '접기',
      filter_all: '전체',
      color_orange: '분노 · 억울함',
      color_blue: '슬픔 · 상실',
      color_pink: '그리움 · 부드러움',
      color_green: '피로 · 권태',
      color_purple: '방황 · 혼란',
      color_gray: '무감각 · 공허',
      color_gold: '기쁨 · 감사',
      my_ribbons: '내 리본',
      witness_placeholder: '증인 코드 입력…',
      tie_btn: '리본 묶기',
      witness_btn: '코드로 찾기',
      tie_title: '지금, 무슨 말을 하고 싶나요?',
      tie_subtitle: '그냥 써도 돼요. 이유도, 완성도 필요 없어요.',
      tie_placeholder: '오늘, 나는…',
      tie_ready: '준비됐어요',
      tie_sensing: '당신의 감정을 느끼는 중…',
      tie_btn_submit: '이 리본 묶기',
      tie_done_title: '리본이 나무에 묶였어요',
      tie_done_subtitle: '증인 코드를 저장하면 언제든지 답변을 확인할 수 있어요.',
      tie_witness_hint: '이것은 당신과 이 이야기를 잇는 유일한 연결고리예요.',
      tie_saved_hint: '<strong>이 브라우저</strong>에 자동 저장됩니다. 브라우저를 바꾸거나 데이터를 지우면 사라져요.',
      tie_confirm: '알겠어요',
      crisis_text: '또는 연락하세요',
      crisis_link: '위기상담전화',
      resonance_count: (n) => `공명 · ${n}`,
      resonance_placeholder: '공명을 남겨주세요 (50자 이내)…',
      resonance_submit: '공명 남기기',
      author_append_label: (t) => `작성자 추가 · ${t}`,
      witness_input_placeholder: '증인 코드 입력',
      witness_verify: '확인',
      witness_hint: '게시 시 생성된 12자리 비밀 코드예요. 본인만 알고 있어요.',
      witness_error: '증인 코드가 올바르지 않아요. 다시 시도해주세요.',
      append_placeholder: '추가하고 싶은 말…（이후 감정이나 새로운 소식）',
      append_submit: '리본에 추가',
      moderation_blocked: '부적절한 내용이 포함되어 전송이 차단되었어요.',
      my_ribbons_title: '내 리본',
      my_ribbons_hint: '기록은 <strong style="color:rgba(200,155,80,0.6);">이 브라우저</strong>에 저장됩니다. 브라우저를 바꾸거나 데이터를 지우면 사라져요.<br>장기 보관하려면 WPS 노트에 저장하세요.',
      my_ribbons_empty: '아직 묶은 리본이 없어요.',
      welcome_eyebrow: '황금색 리본 하나가 이 나무에 걸려 있어요',
      no_ribbons: '아직 리본이 없어요. 첫 번째가 되어보세요.',
      just_now: '방금',
      minutes_ago: (n) => `${n}분 전`,
      hours_ago: (n) => `${n}시간 전`,
      days_ago: (n) => `${n}일 전`,
      months_ago: (n) => `${n}개월 전`,
      years_ago: (n) => `${n}년 전`,
      ai_label: '나무속삭임',
      visitors_today: (n) => `${n}명 온라인`,
      nav_back: '나무로 돌아가기',
      nav_topics: '주제',
      nav_faq: 'FAQ',
      nav_about: '소개',
      pg_real_mode: '실시간 따라가기',
      pg_demo_mode: '타임랩스 데모 (30초/시간대)',
      pg_auto_hint: '실제 계절과 시간에 맞춰 자동 전환',
      pg_demo_hint: '데모: 30초마다 시간대 전환, 4개 완료 후 다음 계절로',
      share_link: '공유 링크 복사',
      share_copied: '복사됨',
      author_toggle: '이 리본의 작성자로 더 쓰고 싶어요',
      crisis_title: '괴로운 표현이 감지되었습니다',
      crisis_body_html: '지금 당신의 감정은 소중합니다. 너무 힘들다면 전국 심리 지원 핫라인 <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong> 또는 <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">위기상담전화</a>로 연락하세요. 들어줄 사람이 있습니다.<br><br>지금은 리본을 묶을 수 없지만, 당신은 혼자가 아닙니다.',
      rewrite: '다시 쓰기',
      wps_save: 'WPS 노트에 저장',
      wps_archive: 'WPS 노트 열기',
      welcome_story_html: '오늘 한 사람이 오래 마음에 담아두었던 말을 드디어 적었습니다.<br><br>누구에게 보여주려는 게 아니라, 그냥 적기 위해.<br><br>적고 나서 여기에 걸었습니다. 조금은 가벼워졌습니다.',
      welcome_desc_html: '여기는 <strong>TiedStory</strong>입니다.<br>가입도 설명도, 들킬 걱정도 없습니다.<br><br>마음 속 한마디를 리본으로 묶으세요.<br>나무에 남고 바람에 흔들리며 누군가의 눈에 은은히 닿을 수 있습니다.',
      loading_failed: '불러오지 못했습니다. 다시 시도해 주세요.',
      witness_entered: '입력됨',
      checking: '확인 중…',
      submitting: '제출 중…',
    }
  },

  'fr': {
    flag: '🇫🇷', label: 'Français', dir: 'ltr',
    t: {
      morning: 'Matin', noon: 'Midi', dusk: 'Crépuscule', night: 'Nuit',
      spring: 'Printemps', summer: 'Été', autumn: 'Automne', winter: 'Hiver',
      slogan: 'Chaque ruban est la preuve que tu vis avec sincérité.',
      ribbon_count: (n) => `${n} rubans`,
      shuffle: 'Découvrir',
      view_all: 'Voir tout',
      collapse: 'Réduire',
      filter_all: 'Tout',
      color_orange: 'Colère · Rancœur',
      color_blue: 'Tristesse · Perte',
      color_pink: 'Tendresse · Nostalgie',
      color_green: 'Épuisement · Fatigue',
      color_purple: 'Confusion · Doute',
      color_gray: 'Engourdissement · Vide',
      color_gold: 'Joie · Gratitude',
      my_ribbons: 'Mes rubans',
      witness_placeholder: 'Code témoin…',
      tie_btn: 'Nouer un ruban',
      witness_btn: 'Trouver par code',
      tie_title: 'Que veux-tu dire maintenant ?',
      tie_subtitle: 'Écris simplement. Pas besoin de raison, ni d\'être complet.',
      tie_placeholder: 'Aujourd\'hui, je…',
      tie_ready: 'Je suis prêt(e)',
      tie_sensing: 'Perception de tes émotions…',
      tie_btn_submit: 'Nouer ce ruban',
      tie_done_title: 'Ton ruban est noué à l\'arbre',
      tie_done_subtitle: 'Sauvegarde ce code témoin pour consulter les réponses.',
      tie_witness_hint: 'C\'est le seul lien entre toi et ton histoire.',
      tie_saved_hint: 'Sauvegardé automatiquement dans <strong>ce navigateur</strong>. Sera perdu si tu changes de navigateur ou effaces les données.',
      tie_confirm: 'Compris',
      crisis_text: 'ou contacte',
      crisis_link: 'la ligne de crise',
      resonance_count: (n) => `Échos · ${n}`,
      resonance_placeholder: 'Laisse un écho (50 mots max)…',
      resonance_submit: 'Laisser un écho',
      author_append_label: (t) => `Ajout de l'auteur · ${t}`,
      witness_input_placeholder: 'Entre ton code témoin',
      witness_verify: 'Vérifier',
      witness_hint: 'Le code à 12 chiffres généré lors de la publication — tu es le seul à le connaître.',
      witness_error: 'Code témoin incorrect. Réessaie.',
      append_placeholder: 'Ajouter une suite… (tes ressentis, de nouveaux développements)',
      append_submit: 'Ajouter au ruban',
      moderation_blocked: 'Contenu signalé. Message non envoyé.',
      my_ribbons_title: 'Mes Rubans',
      my_ribbons_hint: 'Les données sont sauvegardées dans <strong style="color:rgba(200,155,80,0.6);">ce navigateur</strong>. Elles seront perdues si tu changes de navigateur ou effaces les données.<br>Pour une conservation longue durée, enregistre-les dans WPS Notes.',
      my_ribbons_empty: "Tu n'as pas encore noué de ruban.",
      welcome_eyebrow: 'Un ruban doré est noué à cet arbre',
      no_ribbons: 'Aucun ruban pour l\'instant — sois le premier.',
      just_now: 'à l\'instant',
      minutes_ago: (n) => `il y a ${n} min`,
      hours_ago: (n) => `il y a ${n} h`,
      days_ago: (n) => `il y a ${n} j`,
      months_ago: (n) => `il y a ${n} mois`,
      years_ago: (n) => `il y a ${n} an${n > 1 ? 's' : ''}`,
      ai_label: 'SouffleArbre',
      visitors_today: (n) => `${n} en ligne`,
      nav_back: 'Retour à l\'arbre',
      nav_topics: 'Thèmes',
      nav_faq: 'FAQ',
      nav_about: 'À propos',
      pg_real_mode: 'Suivre l\'heure réelle',
      pg_demo_mode: 'Démo time-lapse (30s/période)',
      pg_auto_hint: 'Bascule automatiquement selon la saison et l\'heure réelles',
      pg_demo_hint: 'Démo : cycles de 30s par période, puis passage à la saison suivante',
      share_link: 'Copier le lien',
      share_copied: 'Copié',
      author_toggle: 'J\'ai écrit ce ruban et je veux ajouter du texte',
      crisis_title: 'Nous avons remarqué des mots douloureux',
      crisis_body_html: 'Ce que tu ressens compte. Si tu vas très mal, appelle la ligne d\'aide psychologique nationale <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong> ou contacte <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">la ligne de crise</a>. Quelqu\'un t\'écoutera.<br><br>Ce ruban ne peut pas être noué pour l\'instant, mais tu n\'es pas seul(e).',
      rewrite: 'Réécrire',
      wps_save: 'Enregistrer dans WPS Notes',
      wps_archive: 'Ouvrir WPS Notes',
      welcome_story_html: 'Quelqu\'un a enfin écrit les mots qu\'il retenait depuis longtemps.<br><br>Pas pour être lu — seulement pour les écrire.<br><br>Puis il les a accrochés ici. Un peu plus léger.',
      welcome_desc_html: 'Ici, c\'est <strong>TiedStory</strong>.<br>Pas d\'inscription, pas d\'explication, pas de peur d\'être reconnu(e).<br><br>Transforme ton fardeau en ruban.<br>Elle reste sur l\'arbre, bouge au vent, et peut être vue par un inconnu.',
      loading_failed: 'Échec du chargement. Réessaie.',
      witness_entered: 'Saisi',
      checking: 'Vérification…',
      submitting: 'Envoi…',
    }
  },

  'ru': {
    flag: '🇷🇺', label: 'Русский', dir: 'ltr',
    t: {
      morning: 'Утро', noon: 'Полдень', dusk: 'Сумерки', night: 'Ночь',
      spring: 'Весна', summer: 'Лето', autumn: 'Осень', winter: 'Зима',
      slogan: 'Каждая лента — доказательство того, что ты живёшь по-настоящему.',
      ribbon_count: (n) => `${n} лент`,
      shuffle: 'Случайное',
      view_all: 'Все',
      collapse: 'Свернуть',
      filter_all: 'Все',
      color_orange: 'Гнев · Обида',
      color_blue: 'Грусть · Потеря',
      color_pink: 'Нежность · Тоска',
      color_green: 'Усталость · Апатия',
      color_purple: 'Растерянность · Сомнение',
      color_gray: 'Оцепенение · Пустота',
      color_gold: 'Радость · Благодарность',
      my_ribbons: 'Мои ленты',
      witness_placeholder: 'Код свидетеля…',
      tie_btn: 'Завязать ленту',
      witness_btn: 'Найти по коду',
      tie_title: 'Что ты хочешь сказать сейчас?',
      tie_subtitle: 'Просто напиши. Не нужно причин, не нужно законченности.',
      tie_placeholder: 'Сегодня я…',
      tie_ready: 'Я готов(а)',
      tie_sensing: 'Чувствую твои эмоции…',
      tie_btn_submit: 'Завязать эту ленту',
      tie_done_title: 'Лента привязана к дереву',
      tie_done_subtitle: 'Сохрани код свидетеля, чтобы видеть ответы в любое время.',
      tie_witness_hint: 'Это единственная связь между тобой и твоей историей.',
      tie_saved_hint: 'Автоматически сохранено в <strong>этом браузере</strong>. Исчезнет при смене браузера или очистке данных.',
      tie_confirm: 'Понятно',
      crisis_text: 'или свяжись с',
      crisis_link: 'линией помощи',
      resonance_count: (n) => `Отклики · ${n}`,
      resonance_placeholder: 'Оставь отклик (до 50 слов)…',
      resonance_submit: 'Оставить отклик',
      author_append_label: (t) => `Добавлено автором · ${t}`,
      witness_input_placeholder: 'Введи код свидетеля',
      witness_verify: 'Проверить',
      witness_hint: '12-значный код, созданный при публикации — знаешь только ты.',
      witness_error: 'Неверный код. Попробуй снова.',
      append_placeholder: 'Добавить продолжение… (как ты сейчас, что изменилось)',
      append_submit: 'Добавить к ленте',
      moderation_blocked: 'Содержание нарушает правила. Сообщение не отправлено.',
      my_ribbons_title: 'Мои ленты',
      my_ribbons_hint: 'Данные сохранены в <strong style="color:rgba(200,155,80,0.6);">этом браузере</strong>. Исчезнут при смене браузера или очистке данных.<br>Для долгого хранения лучше сохранить их в WPS Notes.',
      my_ribbons_empty: 'Ты ещё не завязал(а) ни одной ленты.',
      welcome_eyebrow: 'На этом дереве висит золотая лента',
      no_ribbons: 'Лент пока нет — будь первым.',
      just_now: 'только что',
      minutes_ago: (n) => `${n} мин назад`,
      hours_ago: (n) => `${n} ч назад`,
      days_ago: (n) => `${n} д назад`,
      months_ago: (n) => `${n} мес назад`,
      years_ago: (n) => `${n} г назад`,
      ai_label: 'ГолосДерева',
      visitors_today: (n) => `${n} онлайн`,
      nav_back: 'Вернуться к дереву',
      nav_topics: 'Темы',
      nav_faq: 'FAQ',
      nav_about: 'О нас',
      pg_real_mode: 'Следовать реальному времени',
      pg_demo_mode: 'Демо покадровой съёмки (30с/период)',
      pg_auto_hint: 'Автопереключение по реальному сезону и времени суток',
      pg_demo_hint: 'Демо: 30с на период, 4 периода — следующий сезон',
      share_link: 'Копировать ссылку',
      share_copied: 'Скопировано',
      author_toggle: 'Я автор этой ленты и хочу добавить текст',
      crisis_title: 'Мы заметили болезненные слова',
      crisis_body_html: 'Твои чувства важны. Если очень тяжело, позвони на горячую линию психологической помощи <strong style="color:rgba(240,150,150,0.85);">400-161-9995</strong> или свяжись с <a class="tie-crisis-link" href="https://www.lifeline.org.cn" target="_blank">линией помощи</a>. Там выслушают.<br><br>Сейчас ленту нельзя завязать, но ты не один(а).',
      rewrite: 'Переписать',
      wps_save: 'Сохранить в WPS Notes',
      wps_archive: 'Открыть WPS Notes',
      welcome_story_html: 'Кто-то наконец записал слова, которые давно держал внутри.<br><br>Не для кого-то — просто чтобы выписать.<br><br>Потом повесил это здесь. Стало чуть легче.',
      welcome_desc_html: 'Это <strong>TiedStory</strong>.<br>Без регистрации, объяснений и страха узнать тебя.<br><br>Преврати слова в ленту.<br>Она останется на дереве, качается на ветру и может быть увидена незнакомцем.',
      loading_failed: 'Не удалось загрузить. Попробуйте снова.',
      witness_entered: 'Введено',
      checking: 'Проверка…',
      submitting: 'Отправка…',
    }
  }
};

// ─── 语言检测与切换核心 ─────────────────────────────────────────────────────

const I18N_STORAGE_KEY = 'ts_lang';

/**
 * 根据浏览器语言自动匹配，返回语言代码
 */
function i18nDetectLang() {
  const saved = localStorage.getItem(I18N_STORAGE_KEY);
  if (saved && I18N_LANGS[saved]) return saved;

  const nav = (navigator.language || navigator.userLanguage || 'zh-CN').toLowerCase();
  if (nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-mo')) return 'zh-TW';
  if (nav.startsWith('zh')) return 'zh-CN';
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('ru')) return 'ru';
  if (nav.startsWith('en')) return 'en';
  return 'zh-CN'; // 默认简中
}

let _currentLang = i18nDetectLang();

/**
 * 获取当前翻译对象
 */
function i18nT() {
  return I18N_LANGS[_currentLang].t;
}

function i18nValue(key, ...args) {
  const current = I18N_LANGS[_currentLang]?.t ?? {};
  const fallback = I18N_LANGS['zh-CN']?.t ?? {};
  const value = current[key] !== undefined ? current[key] : fallback[key];
  if (typeof value === 'function') return value(...args);
  return value;
}

/**
 * 切换语言并刷新页面文本
 */
function i18nSetLang(code) {
  if (!I18N_LANGS[code]) return;
  _currentLang = code;
  localStorage.setItem(I18N_STORAGE_KEY, code);
  const rc = document.getElementById('ribbonTotalCount');
  if (rc && typeof window.TS_RIBBON_TOTAL === 'number') {
    rc.setAttribute('data-i18n-n', String(window.TS_RIBBON_TOTAL));
  }
  i18nApply();
  i18nRenderSwitcher();
  document.dispatchEvent(new CustomEvent('tiedstory:langchange', { detail: { lang: code } }));
}

/**
 * 获取当前语言代码
 */
function i18nGetLang() {
  return _currentLang;
}

/**
 * 将翻译应用到 DOM（有 data-i18n 属性的元素）
 * data-i18n="key"             → 设置 textContent
 * data-i18n-html="key"        → 设置 innerHTML
 * data-i18n-placeholder="key" → 设置 placeholder
 * data-i18n-title="key"       → 设置 title
 */
function i18nApply() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const n = el.getAttribute('data-i18n-n');
    const value = n !== null ? i18nValue(key, Number(n)) : i18nValue(key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-n]:not([data-i18n])').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (!key) return;
    const value = i18nValue(key, Number(el.getAttribute('data-i18n-n') || 0));
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const value = i18nValue(key);
    if (value !== undefined) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = i18nValue(key);
    if (value !== undefined) el.placeholder = value;
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const value = i18nValue(key);
    if (value !== undefined) el.title = value;
  });

  // 更新 html lang 属性
  document.documentElement.lang = _currentLang;

  // 更新背景矩阵标签
  i18nUpdateBgMatrixLabels();
}

// ─── 语言切换器渲染 ──────────────────────────────────────────────────────────

/**
 * 渲染右上角语言切换器到 #langSwitcher 容器
 */
function i18nRenderSwitcher() {
  const container = document.getElementById('langSwitcher');
  if (!container) return;

  // 下拉菜单开关
  const current = I18N_LANGS[_currentLang];
  container.innerHTML = `
    <div class="lang-switcher-wrap">
      <button class="lang-switcher-btn" id="langSwitcherBtn" onclick="i18nToggleDropdown()" aria-haspopup="true" aria-expanded="false">
        <span class="lang-flag">${current.flag}</span>
        <svg class="lang-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="lang-dropdown" id="langDropdown" style="display:none;">
        ${Object.entries(I18N_LANGS).map(([code, cfg]) => `
          <button class="lang-option ${code === _currentLang ? 'active' : ''}" onclick="i18nSetLang('${code}'); i18nCloseDropdown()">
            <span class="lang-flag">${cfg.flag}</span>
            <span class="lang-name">${cfg.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function i18nToggleDropdown() {
  const dropdown = document.getElementById('langDropdown');
  const btn = document.getElementById('langSwitcherBtn');
  if (!dropdown) return;
  const isOpen = dropdown.style.display !== 'none';
  dropdown.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
}

function i18nCloseDropdown() {
  const dropdown = document.getElementById('langDropdown');
  const btn = document.getElementById('langSwitcherBtn');
  if (dropdown) dropdown.style.display = 'none';
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// 点击外部关闭下拉
document.addEventListener('click', function(e) {
  if (!e.target.closest('#langSwitcher')) {
    i18nCloseDropdown();
  }
});

// ─── 更新背景矩阵标签（Playground 季节×时段矩阵）────────────────────────────
function i18nUpdateBgMatrixLabels() {
  const t = i18nT();
  document.querySelectorAll('[data-bg-label]').forEach(el => {
    const key = el.getAttribute('data-bg-label'); // 如 "spring_morning"
    const parts = key.split('_');
    if (parts.length === 2) {
      const season = t[parts[0]] || parts[0];
      const time = t[parts[1]] || parts[1];
      // 不同语言的连接符不同
      const sep = _currentLang === 'en' || _currentLang === 'ja' || _currentLang === 'ko' ? ' · ' :
                  _currentLang === 'fr' || _currentLang === 'ru' ? ' · ' : '·';
      el.textContent = `${season}${sep}${time}`;
    }
  });
}

// ─── 辅助：time_ago 多语言版本 ────────────────────────────────────────────────
function i18nTimeAgo(ts) {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return i18nValue('just_now');
  if (diff < 3600) return i18nValue('minutes_ago', Math.floor(diff / 60));
  if (diff < 86400) return i18nValue('hours_ago', Math.floor(diff / 3600));
  if (diff < 86400 * 30) return i18nValue('days_ago', Math.floor(diff / 86400));
  if (diff < 86400 * 365) return i18nValue('months_ago', Math.floor(diff / (86400 * 30)));
  return i18nValue('years_ago', Math.floor(diff / (86400 * 365)));
}

function i18nInit() {
  i18nRenderSwitcher();
  i18nApply();
}
