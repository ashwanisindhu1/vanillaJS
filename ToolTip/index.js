/* Helper functions */

// This function decides the postion of tooltip in following order: top, bottom, right and left.
function setToolTipPosition(element, toolTipDiv) {
  const elementPos = element.getBoundingClientRect();
  const toolTipDivPos = toolTipDiv.getBoundingClientRect();

  const toolTipGap = 2;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const canShowAtTop = toolTipDivPos.height + toolTipGap < elementPos.top;
  const canShowAtBottom = toolTipDivPos.height + toolTipGap < (windowHeight - elementPos.bottom);
  const canShowAtLeft = toolTipDivPos.width + toolTipGap < elementPos.left;
  const canShowAtRight = toolTipDivPos.width + toolTipGap < (windowWidth - elementPos.right);

  let styleP = '';
  if(canShowAtTop) {
    styleP = `top: ${elementPos.top - toolTipDivPos.height - toolTipGap}px; left: ${elementPos.left}px;`
  } else if(canShowAtBottom) {
    styleP = `top: ${elementPos.bottom + toolTipGap}px; left: ${elementPos.left}px;`
  } else if(canShowAtRight) {
    styleP = `top: ${elementPos.top}px; left: ${elementPos.right + toolTipGap}px;`
  } else if(canShowAtLeft) {
    styleP =  `top: ${elementPos.top}px; left: ${elementPos.left - toolTipDivPos.width - toolTipGap}px;`
  } else {
    return false; // can't show the tooltip
  }

  toolTipDiv.setAttribute("style",styleP);
}

// This function takes config as input and returns a new div which can be inserted into the DOM.
function getToolTipDiv(config) {
  const toolTipDiv = document.createElement("div");
  toolTipDiv.className = "vanillaToolTip";

  const toolTipTitle = document.createElement("h3");
  toolTipTitle.appendChild(document.createTextNode(config.title));

  const toolTipContent = document.createElement("p");
  toolTipContent.appendChild(document.createTextNode(config.content));

  const toolTipAction = document.createElement("button");
  toolTipAction.appendChild(document.createTextNode("Okay"));
  toolTipAction.setAttribute('style', 'float: right;');
  toolTipAction.addEventListener('click', function() {
    config.onApprove();
    this.parentElement.remove();
  });

  toolTipDiv.appendChild(toolTipTitle);
  toolTipDiv.appendChild(toolTipContent);
  toolTipDiv.appendChild(toolTipAction);
  return toolTipDiv;
}

/* Helper functions END */

/* showToolTip implementation */
Element.prototype.showToolTip = function(config) {
  const toolTipDiv = getToolTipDiv(config);
  const firstChild = document.body.firstChild;

  firstChild.parentNode.insertBefore(toolTipDiv, firstChild);
  setToolTipPosition(this, toolTipDiv);
};

/* showToolTip implementation END */


/* Sample use of the showToolTip function */
const infoElements = document.querySelectorAll('.info');
infoElements.forEach((elem)=>{
  elem.addEventListener('click', function(){
    this.showToolTip({
      title: "More info ",
      content: "This is a fact established by Wikipedia.",
      onApprove: () => { console.log('I am clicked!'); }
    })
  })
})

