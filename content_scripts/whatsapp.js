var imgs = document.querySelectorAll('div[data-animate-status-v3-viewer="true"] img');
if (imgs.length >= 3) {
    let storyUrl = imgs[imgs.length - 1].src;
    let username = imgs[0].parentElement.parentElement.nextSibling.children[0].innerText;
    chrome.runtime.sendMessage (null, {
        site: "whatsapp",
        username: username,
        url: storyUrl + "#.jpg"
    });
} else {
    chrome.runtime.sendMessage (null, { noStories:true });
}