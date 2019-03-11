const allHeadings = document.querySelectorAll(".accordionItem h3");
const allContent = document.querySelectorAll(".accordionItemContent");

allHeadings.forEach(node => {
  node.addEventListener("click", function(e) {
    e.preventDefault();
    const contentNode = this.nextSibling.nextSibling;
    const currentNodeClassName = contentNode.className;

    for (let i = 0; i < allContent.length; i++) {
      allContent[i].classList.remove("open");
      allContent[i].classList.add("closed");
    }

    if (currentNodeClassName === "accordionItemContent closed") {
      contentNode.className = "accordionItemContent open";
    }
  });
});
