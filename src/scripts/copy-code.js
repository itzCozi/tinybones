function initializeCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((codeBlock) => {
    if (codeBlock.parentNode.classList.contains("code-block-wrapper")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";

    const copyButton = document.createElement("button");
    copyButton.className = "copy-code-button";
    copyButton.setAttribute("aria-label", "Copy to clipboard");
    copyButton.textContent = "Copy";

    codeBlock.parentNode.insertBefore(wrapper, codeBlock);

    wrapper.appendChild(codeBlock);
    wrapper.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
      try {
        const codeElement = codeBlock.querySelector("code");
        const codeText = codeElement
          ? codeElement.textContent
          : codeBlock.textContent;

        await navigator.clipboard.writeText(codeText);

        copyButton.textContent = "Copied";
        copyButton.classList.add("copied");

        setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code: ", err);

        try {
          const textArea = document.createElement("textarea");
          textArea.value = codeText;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          if (document.getSelection) {
            const selection = document.getSelection();
            const range = document.createRange();
            range.selectNodeContents(textArea);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          
          copyButton.textContent = "Copied";
          copyButton.classList.add("copied");
          
          setTimeout(() => {
            copyButton.textContent = "Copy";
            copyButton.classList.remove("copied");
          }, 2000);
          
        } catch (fallbackErr) {
          console.error("Fallback copy failed: ", fallbackErr);
          copyButton.textContent = "Copy failed";
          
          setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 2000);
        } finally {
          if (document.body.contains(textArea)) {
            document.body.removeChild(textArea);
          }
        }
      }
    });
  });
}

document.addEventListener("astro:page-load", initializeCopyButtons);

if (document.readyState !== "loading") {
  initializeCopyButtons();
}
