document.addEventListener("DOMContentLoaded", () => {
  const IDE_DOWNLOAD_URL = "https://example.com/your-ide-download.zip"; // Replace with your actual IDE download URL.

  const hero = document.querySelector(".hero");
  const fileInput = document.getElementById("fileInput");
  const fileNameInput = document.getElementById("fileName");
  const editor = document.getElementById("editor");
  const codePreview = document.getElementById("codePreview");
  const langSelect = document.getElementById("lang");
  const status = document.getElementById("status");
  const newDocBtn = document.getElementById("newDoc");
  const escapeDocBtn = document.getElementById("escapeDoc");
  const saveDocBtn = document.getElementById("saveDoc");
  const downloadIdeBtn = document.getElementById("downloadIde");

  if (hero) {
    const info = document.createElement("p");
    info.textContent = "Upload a document or write from scratch, then save it locally.";
    info.className = "note";
    hero.appendChild(info);
  }

  const setStatus = (message, type = "info") => {
    if (!status) return;
    status.textContent = message;
    status.className = `status ${type}`;
  };

  const escapeHtml = (text = "") =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const highlight = (code = "", lang = "txt") => {
    const esc = escapeHtml(code);
    const wrap = (cls, content) => `<span class="token ${cls}">${content}</span>`;

    const highlightJS = (input) => {
      const keywords =
        /\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|class|new|this|throw|catch|try|await|async|import|from|export|default|extends|super|static|of|in|typeof|instanceof|void|delete|yield)\b/g;
      const numbers = /\b(-?\d+(\.\d+)?([eE][-+]?\d+)?)\b/g;
      const strings = /(["'`])(?:\\.|(?!\1).)*\1/g;
      const comments = /(\/\*[\s\S]*?\*\/|\/\/.*$)/gm;
      return input
        .replace(comments, (m) => wrap("comment", m))
        .replace(strings, (m) => wrap("string", m))
        .replace(keywords, (m) => wrap("keyword", m))
        .replace(numbers, (m) => wrap("number", m));
    };

    const highlightPython = (input) => {
      const keywords =
        /\b(def|class|return|if|elif|else|for|while|break|continue|try|except|finally|with|as|import|from|lambda|yield|pass|global|nonlocal|assert|raise|in|is|not|and|or|True|False|None)\b/g;
      const numbers = /\b(-?\d+(\.\d+)?([eE][-+]?\d+)?)\b/g;
      const strings = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
      const comments = /(#.*$)/gm;
      return input
        .replace(comments, (m) => wrap("comment", m))
        .replace(strings, (m) => wrap("string", m))
        .replace(keywords, (m) => wrap("keyword", m))
        .replace(numbers, (m) => wrap("number", m));
    };

    const highlightJava = (input) => {
      const keywords =
        /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g;
      const types = /\b(String|Integer|Long|Double|Float|Character|Boolean|Object|List|Map|Set|HashMap|ArrayList|HashSet)\b/g;
      const numbers = /\b(-?\d+(\.\d+)?([eE][-+]?\d+)?)\b/g;
      const strings = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
      const comments = /(\/\*[\s\S]*?\*\/|\/\/.*$)/gm;
      return input
        .replace(comments, (m) => wrap("comment", m))
        .replace(strings, (m) => wrap("string", m))
        .replace(types, (m) => wrap("function", m))
        .replace(keywords, (m) => wrap("keyword", m))
        .replace(numbers, (m) => wrap("number", m));
    };

    const highlightJSON = (input) => {
      const strings = /("(?:\\.|[^"\\])*")/g;
      const numbers = /\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;
      const booleans = /\b(true|false|null)\b/g;
      return input
        .replace(strings, (m) => wrap("string", m))
        .replace(numbers, (m) => wrap("number", m))
        .replace(booleans, (m) => wrap("boolean", m));
    };

    const highlightCSS = (input) => {
      const comments = /(\/\*[\s\S]*?\*\/)/g;
      const props = /([a-zA-Z-]+)(\s*:\s*)/g;
      const numbers = /(-?\d*\.?\d+)(px|rem|em|%|vh|vw)?/g;
      const strings = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
      return input
        .replace(comments, (m) => wrap("comment", m))
        .replace(strings, (m) => wrap("string", m))
        .replace(props, (_, p1, p2) => `${wrap("attr-name", p1)}${wrap("punct", p2)}`)
        .replace(numbers, (m) => wrap("number", m));
    };

    const highlightHTML = (input) => {
      return input.replace(
        /(&lt;\/?)([\w-]+)([^&]*?)(\/?&gt;)/g,
        (_, open, tag, attrs, close) =>
          `${wrap("punct", open)}${wrap("tag", tag)}${attrs
            .replace(/([\w:-]+)(\s*=\s*)(".*?"|'.*?'|[^\s"'>]+)/g, (__, name, eq, value) =>
              `${wrap("attr-name", name)}${wrap("punct", eq)}${wrap("attr-value", value)}`
            )}${wrap("punct", close)}`
      );
    };

    switch (lang) {
      case "js":
        return highlightJS(esc);
      case "py":
        return highlightPython(esc);
      case "java":
        return highlightJava(esc);
      case "json":
        return highlightJSON(esc);
      case "css":
        return highlightCSS(esc);
      case "html":
        return highlightHTML(esc);
      default:
        return esc;
    }
  };

  const detectLang = () => {
    const name = (fileNameInput?.value || "").toLowerCase();
    if (langSelect && langSelect.value !== "auto") return langSelect.value;
    if (name.endsWith(".js") || name.endsWith(".ts")) return "js";
    if (name.endsWith(".py")) return "py";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".html") || name.endsWith(".htm")) return "html";
    if (name.endsWith(".css")) return "css";
    return "txt";
  };

  const updatePreview = () => {
    if (!codePreview || !editor) return;
    const lang = detectLang();
    codePreview.innerHTML = highlight(editor.value || "", lang);
  };

  fileInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor.value = reader.result;
        if (fileNameInput && fileNameInput.value.trim() === "") {
          fileNameInput.value = file.name;
        }
        setStatus(`Loaded "${file.name}".`);
        updatePreview();
      }
    };
    reader.onerror = () => setStatus("Could not read the file.", "error");
    reader.readAsText(file);
  });

  newDocBtn?.addEventListener("click", () => {
    editor.value = "";
    if (fileInput) fileInput.value = "";
    if (fileNameInput) fileNameInput.value = "document.txt";
    setStatus("Started a new blank document.");
    updatePreview();
  });

  saveDocBtn?.addEventListener("click", () => {
    const text = editor.value ?? "";
    const name = (fileNameInput?.value || "").trim() || "document.txt";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`Saved "${name}" locally.`);
  });

  escapeDocBtn?.addEventListener("click", () => {
    if (!editor) return;
    editor.value = escapeHtml(editor.value || "");
    updatePreview();
    setStatus("Escaped special characters in the textarea.");
  });

  downloadIdeBtn?.addEventListener("click", (e) => {
    if (!downloadIdeBtn) return;
    if (IDE_DOWNLOAD_URL.includes("example.com")) {
      e.preventDefault();
      setStatus("Set IDE_DOWNLOAD_URL in js/main.js to your actual IDE download link.", "error");
      return;
    }
    downloadIdeBtn.href = IDE_DOWNLOAD_URL;
    setStatus("Starting IDE download...");
  });

  editor?.addEventListener("input", updatePreview);
  editor?.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const indent = "    "; // 4 spaces
      const start = editor.selectionStart ?? 0;
      const end = editor.selectionEnd ?? start;
      const before = editor.value.slice(0, start);
      const after = editor.value.slice(end);
      editor.value = `${before}${indent}${after}`;
      const newPos = start + indent.length;
      editor.selectionStart = editor.selectionEnd = newPos;
      updatePreview();
    }
  });
  langSelect?.addEventListener("change", updatePreview);
  fileNameInput?.addEventListener("input", updatePreview);
  updatePreview();
});
