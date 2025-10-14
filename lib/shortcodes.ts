type CalloutType = "info" | "success" | "warning" | "danger" | "tip";

function parseAttrs(input: string | undefined) {
  const attrs: Record<string, string> = {};
  if (!input) return attrs;
  const regex = /(\w+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input))) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function iconSvg(type: CalloutType) {
  const base = 'class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5"';
  switch (type) {
    case "success":
      return `<svg viewBox="0 0 24 24" ${base} aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>`;
    case "warning":
      return `<svg viewBox="0 0 24 24" ${base} aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v5"/><path stroke-linecap="round" d="M12 17h.01"/><path stroke-linejoin="round" d="M12 3l9 16H3l9-16z"/></svg>`;
    case "danger":
      return `<svg viewBox="0 0 24 24" ${base} aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9l-6 6M9 9l6 6"/><circle cx="12" cy="12" r="9"/></svg>`;
    case "tip":
      return `<svg viewBox="0 0 24 24" ${base} aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    case "info":
    default:
      return `<svg viewBox="0 0 24 24" ${base} aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6"/><path stroke-linecap="round" d="M12 7h.01"/><circle cx="12" cy="12" r="9"/></svg>`;
  }
}

function variantClasses(type: CalloutType) {
  const common = "not-prose my-6 rounded-2xl border shadow-xl p-4 sm:p-5";
  switch (type) {
    case "success":
      return `${common} border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200`;
    case "warning":
      return `${common} border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200`;
    case "danger":
      return `${common} border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200`;
    case "tip":
      return `${common} border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-200`;
    case "info":
    default:
      return `${common} border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-200`;
  }
}

function iconWrapClasses(type: CalloutType) {
  switch (type) {
    case "success":
      return "text-emerald-600 dark:text-emerald-300 bg-white/70 dark:bg-slate-900/40 ring-1 ring-inset ring-current/20 p-2 rounded-lg";
    case "warning":
      return "text-amber-600 dark:text-amber-300 bg-white/70 dark:bg-slate-900/40 ring-1 ring-inset ring-current/20 p-2 rounded-lg";
    case "danger":
      return "text-rose-600 dark:text-rose-300 bg-white/70 dark:bg-slate-900/40 ring-1 ring-inset ring-current/20 p-2 rounded-lg";
    case "tip":
      return "text-violet-600 dark:text-violet-300 bg-white/70 dark:bg-slate-900/40 ring-1 ring-inset ring-current/20 p-2 rounded-lg";
    case "info":
    default:
      return "text-sky-600 dark:text-sky-300 bg-white/70 dark:bg-slate-900/40 ring-1 ring-inset ring-current/20 p-2 rounded-lg";
  }
}

export function renderShortcodes(html: string) {
  if (!html) return html;
  // 1) Dialog/Callout boxes
  const re = /\[(dialog|callout)(?:\s+([^\]]*))?\]([\s\S]*?)\[\/(dialog|callout)\]/gi;
  let out = html.replace(re, (_match, _tag, attrsStr, inner) => {
    const attrs = parseAttrs(attrsStr);
    const type = (attrs.type as CalloutType) || "info";
    const title = attrs.title || ({
      info: "Information",
      success: "Success",
      warning: "Warning",
      danger: "Important",
      tip: "Tip",
    } as Record<CalloutType, string>)[type];

    const box = variantClasses(type);
    const iconWrap = iconWrapClasses(type);
    const svg = iconSvg(type);

    const content = inner?.trim() || "";

    return `
<div class="${box}">
  <div class="flex items-start gap-3">
    <span class="${iconWrap}">${svg}</span>
    <div class="min-w-0">
      <p class="font-heading font-semibold text-base leading-6">${title}</p>
      <div class="prose prose-slate dark:prose-invert max-w-none mt-1">${content}</div>
    </div>
  </div>
</div>`;
  });

  // 2) FAQ items: [faq question="..."]content[/faq]
  const faqItem = /\[faq(?:\s+([^\]]*))?\]([\s\S]*?)\[\/faq\]/gi;
  const renderFaq = (_m: string, attrsStr: string, inner: string) => {
    const attrs = parseAttrs(attrsStr);
    const question = attrs.q || attrs.question || "Question";
    const answer = inner?.trim() || "";
    return `
<details class="faq-item group rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
  <summary class="flex cursor-pointer select-none items-start justify-between gap-3">
    <span class="text-base font-semibold leading-6">${question}</span>
    <span class="faq-icon mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform dark:bg-slate-800 dark:text-slate-300">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
  </summary>
  <div class="mt-3 border-t border-gray-200 pt-3 dark:border-slate-700 prose prose-slate dark:prose-invert max-w-none">${answer}</div>
</details>`;
  };

  // 3) FAQ group wrapper: [faqs] ... [/faqs]
  const faqGroup = /\[faqs(?:\s+([^\]]*))?\]([\s\S]*?)\[\/faqs\]/gi;
  out = out.replace(faqGroup, (_m, attrsStr, inner) => {
    const attrs = parseAttrs(attrsStr);
    const withControls = attrs.controls === "true" || attrs.controls === "1" || attrs.controls === "yes";
    const rendered = (inner as string).replace(faqItem, renderFaq);
    const controls = withControls
      ? `<div class="faq-controls mb-3 flex items-center gap-2" data-faq-group>
           <button type="button" data-faq-action="open-all" class="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800">Open all</button>
           <button type="button" data-faq-action="close-all" class="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800">Close all</button>
         </div>`
      : "";
    return `${controls}<div class="faq-group space-y-3" data-faq-group>${rendered}</div>`;
  });

  // 4) Standalone FAQ items (not inside [faqs])
  out = out.replace(faqItem, renderFaq);

  return out;
}
