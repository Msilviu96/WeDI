var iFrame = document.createElement("iframe");
iFrame.src = chrome.extension.getURL("../html/popup.html");

document.body.insertBefore(iFrame, document.body.firstChild);