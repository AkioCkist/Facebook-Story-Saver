// Global variables
var elemntdata;
var rangeid = [];
var mediaCache = {};
var postIdCache = {};
var elementping;
var profilePostsCache = {};  // Cache for profile posts
var isProcessingProfile = false;  // Flag to prevent duplicate processing
var tokendsg= document.documentElement.outerHTML.match(/"dtsg":{"token":".*?(?=")/g)[0].split("\"")[5]





// 1. Add these variables and functions at the top of the script (after the existing variable declarations)

// Advertisement system for Instagram Downloader




// Notify background script that the content script is active
chrome.runtime.sendMessage({openig: true}, (response) => {
    console.log('Download handler initialized');
});

// Listen for messages from window
window.addEventListener("message", (event) => {
    if (event.data == "nullvideo" && elementping) {
        elementping.parentElement.parentElement.getElementsByClassName("violet_toolkit_dl_btn")[0].click();
    }
}, false);

// Track hovered elements to determine which element is being interacted with
document.addEventListener('mouseover', function(event) {
    const hoveredElement = event.target;
    let closeelement = hoveredElement.closest('div[data-ig_toolkit_marked="1"]') ||
        hoveredElement.closest('div[toolin="1"]');

    if (closeelement != null) {
        elementping = closeelement;
    }
});

// Message listener for communication with background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.downloadProgress) {
        handleDownloadProgress(request.downloadProgress);
        sendResponse({status: "Progress update received"});
        return true;
    }
    // Handle download confirmation
    if (request.countdow) {
        if (request.countdow == "ok") {
            // Download successful, update UI accordingly
            if(elemntdata.className=="violet_toolkit_dl_btn") {
                elemntdata.getElementsByClassName("violet_toolkit_icon")[0].style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAU1JREFUaEPtmWEKwjAMhbOb6cnUk6knUyMOStasyZKHG6TgH+3a970XasMmOviYDq6fkAAnIroQ0ZOIHr9Pul9IgFejlgHO6eqJYAmw+/cCMESGKqFKwGD+d0oloDhVJVQlZHWgSijoVJ1CVUJVQkEHqoSCBkZOobbjugodlqvE2vNmrAjAWsc1Ahj9DgeQAnjDtm1cE9h7dvPNOJIAt4wsph0zhAagib99FpFlaEohAsAbaBAsSPbE8rtZ4Gbxm2MT1vQgpHucjEyL54TEZwFoSYxKICw+E8ALkSI+G8AKkSYeATCCSBWPAtAg0sUjASQERDwagNefj04+RiEj+kcGEeVZtAA8biHmVgIIVz1rVgIetxBzKwGEq541tQQsTYpnn4y53etID4B7U35BvbfRfdfcA9Aa7z0ALfRqJbS3FNh9LqHFpbBOoX/X1RtDO1oxf0ZfAwAAAABJRU5ErkJggg==')"

            }else {
                elemntdata.getElementsByClassName("violet_toolkit_icon")[0].style.backgroundImage = "url(\"data:image/png;base64,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\")"
            }
        }
    }

    // Handle click action from popup or other parts of the extension
    if (request.clickaction) {
        // Profile page download action
        if (request.profileAction) {
            const profileBtn = document.querySelector('.violet_toolkit_profile_download_btn');
            if (profileBtn) {
                profileBtn.click();
                sendResponse({status: "Profile download initiated"});
                return true;
            }

            // If button not found yet, try to add it first
            checkForProfilePage();
            setTimeout(() => {
                const profileBtn = document.querySelector('.violet_toolkit_profile_download_btn');
                if (profileBtn) {
                    profileBtn.click();
                    sendResponse({status: "Profile download initiated after button creation"});
                } else {
                    sendResponse({status: "Profile button not found"});
                }
            }, 500);
            return true;
        }

        // Regular post or story download action
        if (!location.pathname.includes("stories")) {
            try {
                elementping.parentElement.parentElement.getElementsByClassName("violet_toolkit_dl_btn")[0].click();
                sendResponse({status: "Download initiated"});
            } catch (error) {
                console.error("Error triggering download click:", error);
                sendResponse({status: "Error", error: error.message});
            }
        }
    }

    // Return true to indicate async response
    return true;
});
const filterPopupStyle = document.createElement('style');
filterPopupStyle.textContent = `
.violet_toolkit_popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    color: #262626;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z-index: 9999;
    width: 350px;
    max-width: 90%;
    max-height: 85vh; /* Giới hạn chiều cao tối đa là 85% chiều cao viewport */
    overflow-y: auto; /* Thêm thanh cuộn khi nội dung vượt quá */
    overscroll-behavior: contain; /* Ngăn cuộn lan truyền ra ngoài */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Cải thiện kiểu thanh cuộn cho Chrome */
.violet_toolkit_popup::-webkit-scrollbar {
    width: 8px;
}

.violet_toolkit_popup::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.violet_toolkit_popup::-webkit-scrollbar-thumb {
    background: #c7c7c7;
    border-radius: 4px;
}

.violet_toolkit_popup::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}

/* Cố định header popup khi cuộn */
.violet_toolkit_popup_header {
    position: sticky;
    top: -20px; /* Bù trừ với padding của popup */
    background-color: white;
    margin: -20px -20px 15px -20px;
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #efefef;
    z-index: 1;
}

/* Cố định nút dưới chân khi cuộn */
.violet_toolkit_popup_buttons {
    position: sticky;
    bottom: -20px; /* Bù trừ với padding của popup */
    background-color: white;
    margin: 20px -20px -20px -20px;
    padding: 10px 20px 20px 20px;
    border-top: 1px solid #efefef;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    z-index: 1;
}
`;

document.head.appendChild(filterPopupStyle);
/**
 * Extract post ID from shortcode
 * @param {string} code - Instagram post shortcode
 * @returns {string} - Post ID (pk)
 */
function codetopk(code) {
    if (postIdCache[code]) {
        return postIdCache[code];
    }

    try {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://www.instagram.com/p/" + code, false); // Synchronous for simplicity
        xmlHttp.send(null);
        const match = xmlHttp.responseText.match(/media\?id=.*?(?=")/g);
        if (match && match.length > 0) {
            const pk = match[0].split("=")[1];
            postIdCache[code] = pk;
            return pk;
        }
    } catch (error) {
        console.error("Error converting code to pk:", error);
    }
    return null;
}

/**
 * Send download request to background script
 * @param {object} data - Media data
 * @param {number} rande - Index for carousel media
 * @param {string} user - Username for filename
 * @param {object} datajson - Full media JSON data
 */
function downloadsend(data, rande, user, datajson) {
    trackDownload();
    if (rande != null) {
        let datx = data[rande];
        chrome.runtime.sendMessage({
            downloadv1: datx.urls[0],
            idx: user + "_" + datx.pk,
            url: location.href
        }, (response) => {
            console.log('Download initiated');
        });
    } else {
        chrome.runtime.sendMessage({
            download: data,
            rande,
            user: user,
            datajson: datajson
        }, (response) => {
            console.log('Download initiated');
        });
    }
}

/**
 * Fetch and process story media for a user
 * @param {string} username - Instagram username
 */
function getstorybyusername(username) {
    let userId = null;

    // Check if we already have the user ID cached
    for (let i in rangeid) {
        if (rangeid[i].pkid == username) {
            userId = rangeid[i].userid;
            break;
        }
    }

    if (userId) {
        getstorybyid(userId);
        return;
    }

    // Get CSRF token for API requests
    const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
    const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

    // Fetch user profile to get user ID
    fetch('https://i.instagram.com/api/v1/users/web_profile_info/?username=' + username, {
        method: 'GET',
        headers: {
            "x-instagram-ajax": "1016349901",
            "x-asbd-id": "129477",
            "x-ig-app-id": "936619743392459",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": csrfToken
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(json => {
            if (json.data && json.data.user && json.data.user.id) {
                const userId = json.data.user.id;
                rangeid.push({pkid: username, userid: userId});
                getstorybyid(userId);
            }
        })
        .catch(err => {
            console.error("Error fetching user ID:", err);
        });
}


/**
 * Get highest resolution image URL from image_versions2.candidates array
 * @param {Array} candidates - Array of image candidates with different resolutions
 * @returns {string} - URL of highest resolution image
 */
function getBestImageUrl(candidates) {
    if (!candidates || !candidates.length) {
        return null;
    }

    // Sort candidates by resolution (width * height), highest first
    const sortedCandidates = [...candidates].sort((a, b) => {
        const resA = a.width * a.height;
        const resB = b.width * b.height;
        return resB - resA; // Descending order
    });

    // Return the URL of the highest resolution image
    return sortedCandidates[0].url;
}
/**
 * Fetch story media by user ID
 * @param {string} id - User ID
 */
function getstorybyid(id) {
    // Get CSRF token for API requests
    const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
    const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

    fetch("https://i.instagram.com/api/v1/feed/user/" + id + "/story/", {
        method: 'GET',
        headers: {
            "x-instagram-ajax": "1016349901",
            "x-asbd-id": "129477",
            "x-ig-app-id": "936619743392459",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": csrfToken
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(json => {
            if (json.reel && json.reel.items && json.reel.items.length > 0) {
                const mediaUrls = [];

                json.reel.items.forEach(item => {
                    let mediaUrl = null;

                    if (item.video_versions && item.video_versions.length > 0) {
                        mediaUrl = item.video_versions[0].url;
                    } else if (item.image_versions2 && item.image_versions2.candidates.length > 0) {
                        mediaUrl = getBestImageUrl(item.image_versions2.candidates);
                    }

                    if (mediaUrl) {
                        mediaUrls.push(mediaUrl);
                    }
                });

                // Find story username or use a default
                let storyUsername = "";
                try {
                    storyUsername = json.reel.user.username || id;
                } catch (e) {
                    storyUsername = id;
                }

                // Get the story index from countclick or default to 0
                let storyIndex = typeof countclick !== 'undefined' ? countclick : 0;
                if (storyIndex >= mediaUrls.length) {
                    storyIndex = 0;
                }

                // Send download message to background script
                if (mediaUrls.length > 0) {
                    chrome.runtime.sendMessage({
                        downloadv1: mediaUrls[storyIndex],
                        idx: storyUsername,
                        url: location.href
                    }, (response) => {
                        console.log('Story download initiated');
                    });
                }
            }
        })
        .catch(err => {
            console.error("Error fetching stories:", err);
        });
}

/**
 * Download media for a post by media ID
 * @param {string} pk - Media ID
 * @param {number} range - Index for carousel media
 */
function downloadimg(pk, range) {
    if (mediaCache[pk]) {
        downloadsend(mediaCache[pk].results, range, mediaCache[pk].user, mediaCache[pk].json);
        return;
    }

    // Get CSRF token for API requests
    const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
    const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

    fetch('https://www.instagram.com/api/v1/media/' + pk + '/info/', {
        method: 'GET',
        headers: {
            "x-instagram-ajax": "1016349901",
            "x-asbd-id": "129477",
            "x-ig-app-id": "936619743392459",
            "x-requested-with": "XMLHttpRequest",
            "x-csrftoken": csrfToken
        }
    })
        .then(response => response.json())
        .then(json => {
            const results = [];
            let username = "";

            // Helper function to extract media info
            function extractMedia(media) {
                const mediaInfo = {
                    pk: media.pk,
                    code: media.code,
                    urls: []
                };

                // Add video URL if available
                if (media.video_versions && media.video_versions.length > 0) {
                    mediaInfo.urls.push(media.video_versions[0].url);
                }

                // Add image URL if available
                if (media.image_versions2 && media.image_versions2.candidates.length > 0) {
                    mediaInfo.urls.push(getBestImageUrl(media.image_versions2.candidates));
                }

                return mediaInfo;
            }

            // Process each item in the response
            if (json.items && json.items.length > 0) {
                json.items.forEach(item => {
                    try {
                        username = item.user.username;
                    } catch (e) {
                        // Username not available
                    }

                    // Process carousel media if available
                    if (item.carousel_media && item.carousel_media.length > 0) {
                        item.carousel_media.forEach(media => {
                            const mediaData = extractMedia(media);
                            results.push(mediaData);
                        });
                    } else {
                        // Process single media
                        const mediaData = extractMedia(item);
                        results.push(mediaData);
                    }
                });
            }

            // Cache the results
            mediaCache[pk] = {
                results: results,
                user: username,
                json: json
            };

            // Send the results for download
            downloadsend(results, range, username, json);
        })
        .catch(err => {
            console.error("Error fetching media info:", err);
        });
}

// Story download button click handler
function clickbuttondow1() {
    elemntdata = this;

    // Get username from URL
    const usernameMatch = location.pathname.match(/\/stories\/.*?(?=\/)/g);
    if (usernameMatch && usernameMatch.length > 0) {
        const username = usernameMatch[0].split("/")[2];
        getstorybyusername(username);
    }
}

// Post carousel index (for multi-image posts)
var countclick = 0;

// Add download buttons to stories
function addbutndow() {
    // Find the main section element
    const section = Array.from(document.querySelectorAll('section')).find(t => !t.closest('[hidden]'));
    if (!section) return;

    // Find story container
    let storyContainer = Array.from(section.querySelectorAll('div')).find(tx => {
        let n = tx.clientHeight || tx.offsetHeight;
        if (n > 0 && n < 6) {
            return tx.parentElement;
        }
    });

    if (!storyContainer || !storyContainer.children) return;

    // Count stories
    const storyCount = storyContainer.children.length;
    if (storyCount === 0) return;

    // Find the current story index
    let currentStoryIndex = 0;
    const allDivs = storyContainer.children;

    for (let i = 0; i < allDivs.length; i++) {
        const currentDiv = allDivs[i];
        if (currentDiv.tagName === 'DIV') {
            const nestedDivs = currentDiv.getElementsByTagName('div');
            if (nestedDivs.length > 0) {
                currentStoryIndex = i;
                break;
            }
        }
    }

    countclick = currentStoryIndex;

    // Find the container to add the download button
    const container = allDivs[currentStoryIndex].parentElement.parentElement;

    // Add download button if not already present
    if (!container.getAttribute("toolin")) {
        // Add download button
        const downloadBtn = document.createElement('div');
        downloadBtn.onclick = clickbuttondow1;
        downloadBtn.className = "violet_toolkit_dl_btn";
        downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
        container.appendChild(downloadBtn);

        // Add download all button
        const downloadAllBtn = document.createElement('div');
        downloadAllBtn.onclick = clickbuttondow;
        downloadAllBtn.className = "violet_dowall";
        downloadAllBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
        container.appendChild(downloadBtn);

        // Mark as processed
        container.setAttribute("toolin", "1");
    }
}

// Post download button click handler
function clickbuttondow() {
    elemntdata = this;
    requestAnimationFrame(() => {
        elemntdata.getElementsByClassName("violet_toolkit_icon")[0].style.backgroundImage="url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiIHdpZHRoPSI2MHB4IiBoZWlnaHQ9IjYwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgwLDUwKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjg3NXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC44NzVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4yMTMyMDM0MzU1OTY0Myw3MS4yMTMyMDM0MzU1OTY0MykiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNSIgZmlsbD0iIzc5MzJiZiIgZmlsbC1vcGFjaXR5PSIwLjg3NSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjc1cyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49Ii0wLjc1cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAsODApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoOTApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC43NSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjYyNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC42MjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOC43ODY3OTY1NjQ0MDM1NzcsNzEuMjEzMjAzNDM1NTk2NDMpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuNjI1IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iLTAuNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC41cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAsNTAuMDAwMDAwMDAwMDAwMDEpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTgwKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuNSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjM3NXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4zNzVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOC43ODY3OTY1NjQ0MDM1NywyOC43ODY3OTY1NjQ0MDM1NzcpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMjI1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuMzc1IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iLTAuMjVzIiB2YWx1ZXM9IjEuNSAxLjU7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuMjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OS45OTk5OTk5OTk5OTk5OSwyMCkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgyNzApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC4yNSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjEyNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4xMjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4yMTMyMDM0MzU1OTY0MywyOC43ODY3OTY1NjQ0MDM1NykiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgzMTUpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC4xMjUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSIwcyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49IjBzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz4KPCEtLSBbbGRpb10gZ2VuZXJhdGVkIGJ5IGh0dHBzOi8vbG9hZGluZy5pby8gLS0+PC9zdmc+')"
    });
    setTimeout(() => {
        let carouselIndex = null;

        // Check if this is part of a carousel and get the index
        if (this.className == "violet_toolkit_dl_btn") {
            try {
                // Find carousel indicator
                let mxdoc;
                try {
                    mxdoc = this.closest('div[role*="button"]').getElementsByClassName(" _acvz _acnc _acng")[0].getElementsByTagName("div");
                } catch (ex) {
                    mxdoc = this.closest('article[role*="presentation"]').getElementsByClassName(" _acvz _acnc _acng")[0].getElementsByTagName("div");
                }

                // Find current carousel index
                for (let i = 0; i < mxdoc.length; i++) {
                    if (mxdoc[i].classList.length == 2) {
                        carouselIndex = i;
                        break;
                    }
                }
            } catch (ex) {
                // Not a carousel or error finding index
            }
        }

        // Get post ID and download media
        let postId = this.id;
        if (!postId) {
            // Try to extract from closest link
            const linkElement = this.closest('a[href*="/p/"]');
            if (linkElement) {
                const match = linkElement.href.match(/\/p\/([^\/]+)/);
                if (match && match[1]) {
                    postId = match[1];
                }
            }
        }

        if (postId) {
            const mediaId = codetopk(postId);
            if (mediaId) {
                downloadimg(mediaId, carouselIndex);
            }
        }
    }, 10);
}

// Add download buttons to posts
// Add download buttons to posts
function callpush(element) {
    // Skip if element is too small
    if (element.tagName === 'IMG' && (element.width < 300 || element.height < 300)) {
        // Still check if it's within a post link
        const linkElement = element.closest('a[href]');
        if (linkElement && linkElement.href.match(/\/p\/.*?(?=\/)/g)) {
            const postId = linkElement.href.match(/\/p\/.*?(?=\/)/g)[0].split("/")[2];

            // Add download button if not already added
            if (postId && !linkElement.parentElement.parentElement.getAttribute("toolin")) {
                const downloadBtn = document.createElement('div');
                downloadBtn.id = postId;
                downloadBtn.onclick = clickbuttondow;
                downloadBtn.className = "violet_toolkit_dl_btn";
                downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
                linkElement.parentElement.parentElement.appendChild(downloadBtn);
                linkElement.parentElement.parentElement.setAttribute("toolin", "1");
            }
        }
        return;
    }

    // Check for posts on profile pages
    const isProfilePage = /instagram\.com\/(?!p\/|stories\/|explore\/)[^\/]+\/?$/.test(location.href);

    if (isProfilePage) {
        // On profile pages, posts are typically in a grid layout
        const postContainer = element.closest('article') ||
            element.closest('div[role="button"]') ||
            element.closest('a[href*="/p/"]');

        if (postContainer) {
            // Find the post link to extract shortcode
            const postLink = postContainer.querySelector('a[href*="/p/"]') ||
                (postContainer.tagName === 'A' ? postContainer : null);

            if (postLink && postLink.href) {
                const match = postLink.href.match(/\/p\/([^\/]+)/);
                if (match && match[1]) {
                    const postId = match[1];

                    // Check if button already exists
                    if (!postContainer.getAttribute("toolin")) {
                        // Create button container if needed
                        let buttonContainer = postContainer;

                        // For grid items, position the button at the right spot
                        if (postContainer.tagName === 'A' || postContainer.tagName === 'DIV') {
                            buttonContainer = postContainer;
                        }

                        // Add download button
                        const downloadBtn = document.createElement('div');
                        downloadBtn.id = postId;
                        downloadBtn.onclick = clickbuttondow;
                        downloadBtn.className = "violet_toolkit_dl_btn";
                        downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';

                        // Position the button
                        downloadBtn.style.position = 'absolute';
                        downloadBtn.style.top = '10px';

                        downloadBtn.style.zIndex = '10';

                        // Make sure container has relative positioning for absolute positioning to work
                        if (getComputedStyle(buttonContainer).position === 'static') {
                            buttonContainer.style.position = 'relative';
                        }

                        buttonContainer.appendChild(downloadBtn);
                        buttonContainer.setAttribute("toolin", "1");
                    }
                }
            }
        }
    } else {
        // For non-profile pages, use the original logic
        // Find post ID
        let postId = "";
        const pathMatch = location.pathname.match(/\/p\/.*?(?=\/)|explore/g);

        if (!pathMatch) {
            // Regular feed post
            const article = element.closest('article');
            if (article) {
                const links = article.querySelectorAll('a[href^="/p/"]');
                if (links.length > 0) {
                    postId = links[0].href.split("/")[4];
                }
            }
        } else if (pathMatch[0] === "explore") {
            // Explore page
            const linkElement = element.closest('a[href]');
            if (linkElement && linkElement.href.match(/\/p\/.*?(?=\/)/g)) {
                postId = linkElement.href.match(/\/p\/.*?(?=\/)/g)[0].split("/")[2];

                // Add download button
                if (postId && !linkElement.parentElement.parentElement.getAttribute("toolin")) {
                    const downloadBtn = document.createElement('div');
                    downloadBtn.id = postId;
                    downloadBtn.onclick = clickbuttondow;
                    downloadBtn.className = "violet_toolkit_dl_btn";
                    downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
                    linkElement.parentElement.parentElement.appendChild(downloadBtn);
                    linkElement.parentElement.parentElement.setAttribute("toolin", "1");
                }
            }
            return;
        } else {
            // Single post page
            postId = pathMatch[0].split("/")[2];
        }

        // Find the container to add the download button
        try {
            const container = element.closest('div[role*="presentation"]') ||
                element.closest('div[role*="button"]');

            if (container) {
                container.dataset.ig_toolkit_marked = '1';

                // Add buttons if not already added
                const parentContainer = container.parentElement.parentElement;
                if (postId && !parentContainer.getAttribute("toolin")) {
                    // Add download button
                    const downloadBtn = document.createElement('div');
                    downloadBtn.id = postId;
                    downloadBtn.onclick = clickbuttondow;
                    downloadBtn.className = "violet_toolkit_dl_btn";
                    downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
                    parentContainer.appendChild(downloadBtn);

                    // Add download all button for carousel
                    const downloadAllBtn = document.createElement('div');
                    downloadAllBtn.id = postId;
                    downloadAllBtn.onclick = clickbuttondow;
                    downloadAllBtn.className = "violet_dowall";
                    downloadAllBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
                    parentContainer.appendChild(downloadAllBtn);

                    // Mark as processed
                    parentContainer.setAttribute("toolin", "1");
                }
            }
        } catch (ex) {
            // Try alternative approach for other layouts
            const linkElement = element.closest('a[href]');
            if (linkElement && linkElement.href.match(/\/p\/.*?(?=\/)/g)) {
                const postId = linkElement.href.match(/\/p\/.*?(?=\/)/g)[0].split("/")[2];

                if (postId && !linkElement.parentElement.parentElement.getAttribute("toolin")) {
                    const downloadBtn = document.createElement('div');
                    downloadBtn.id = postId;
                    downloadBtn.onclick = clickbuttondow;
                    downloadBtn.className = "violet_toolkit_dl_btn";
                    downloadBtn.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span><span class="violet_toolkit_icon"></span>';
                    linkElement.parentElement.parentElement.appendChild(downloadBtn);
                    linkElement.parentElement.parentElement.setAttribute("toolin", "1");
                }
            }
        }
    }
}

// Set up mutation observer to add download buttons to new content
// Khởi tạo biến để theo dõi trạng thái xử lý
let isProcessing = false;
let processingTimeout = null;
let mediaElementsToProcess = new Set();

// Tạo một throttled handler để giảm tần suất xử lý
function throttledProcessMediaElements() {
    if (isProcessing) return;
    isProcessing = true;

    // Hủy timeout hiện tại nếu có
    if (processingTimeout) {
        clearTimeout(processingTimeout);
    }

    // Thiết lập timeout mới để xử lý các phần tử sau một khoảng thời gian ngắn
    processingTimeout = setTimeout(() => {
        // Xử lý các phần tử media đã thu thập
        if (mediaElementsToProcess.size > 0) {
            console.log(`Processing ${mediaElementsToProcess.size} media elements`);

            // Xử lý các phần tử media
            mediaElementsToProcess.forEach(element => {
                try {
                    // Gọi callpush cho từng phần tử
                    callpush(element);
                } catch (error) {
                    console.error("Error processing media element:", error);
                }
            });

            // Xóa tất cả phần tử đã xử lý
            mediaElementsToProcess.clear();

            // Thử thêm buttons cho stories nếu có
            try {
                addbutndow();
            } catch (error) {
                console.error("Error adding story buttons:", error);
            }
        }

        // Reset trạng thái xử lý
        isProcessing = false;
    }, 200); // Chờ 200ms giữa các lần xử lý
}

// Hàm để kiểm tra nhanh xem một phần tử có phải là media và cần xử lý không
function shouldProcessMediaElement(element) {
    // Kiểm tra nếu phần tử là hình ảnh hoặc video
    if (element.tagName !== 'IMG' && element.tagName !== 'VIDEO') {
        return false;
    }

    // Kiểm tra nếu phần tử đã được đánh dấu là đã xử lý
    if (element.hasAttribute('data-ig-processed')) {
        return false;
    }

    // Với hình ảnh, kiểm tra kích thước tối thiểu
    if (element.tagName === 'IMG') {
        // Nếu kích thước không đủ lớn, kiểm tra xem có phải là một phần của post không
        if (element.width < 300 || element.height < 300) {
            const isInPost = !!element.closest('a[href*="/p/"]');
            if (!isInPost) {
                return false;
            }
        }
    }

    // Đánh dấu phần tử đã được xử lý để tránh xử lý lặp lại
    element.setAttribute('data-ig-processed', 'true');
    return true;
}

// Tạo MutationObserver với cấu hình tối ưu
const optimizedObserverConfig = {
    childList: true,     // Quan sát thêm/xóa children
    subtree: true,       // Quan sát toàn bộ cây con
    attributeFilter: ['src', 'srcset', 'style', 'class'], // Chỉ quan sát các thuộc tính cần thiết
    attributes: true     // Quan sát thay đổi thuộc tính
};

// Hàm callback cho MutationObserver
function optimizedMutationCallback(mutations) {
    let hasRelevantChanges = false;

    // Kiểm tra nhanh xem có mutation nào liên quan đến media không
    for (const mutation of mutations) {
        // Nếu là thay đổi thuộc tính
        if (mutation.type === 'attributes') {
            const target = mutation.target;
            if ((target.tagName === 'IMG' || target.tagName === 'VIDEO') &&
                !target.hasAttribute('data-ig-processed')) {
                hasRelevantChanges = true;
                if (shouldProcessMediaElement(target)) {
                    mediaElementsToProcess.add(target);
                }
            }
        }
        // Nếu là thay đổi children
        else if (mutation.type === 'childList') {
            // Kiểm tra các node mới thêm vào
            mutation.addedNodes.forEach(node => {
                // Nếu node là phần tử HTML
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Nếu node là media
                    if ((node.tagName === 'IMG' || node.tagName === 'VIDEO') &&
                        !node.hasAttribute('data-ig-processed')) {
                        hasRelevantChanges = true;
                        if (shouldProcessMediaElement(node)) {
                            mediaElementsToProcess.add(node);
                        }
                    }

                    // Tìm tất cả media trong node mới
                    const mediaElements = node.querySelectorAll('img:not([data-ig-processed]), video:not([data-ig-processed])');
                    if (mediaElements.length > 0) {
                        hasRelevantChanges = true;
                        mediaElements.forEach(element => {
                            if (shouldProcessMediaElement(element)) {
                                mediaElementsToProcess.add(element);
                            }
                        });
                    }
                }
            });
        }
    }

    // Nếu có thay đổi liên quan, bắt đầu xử lý
    if (hasRelevantChanges) {
        throttledProcessMediaElements();
    }
}

// Tạo observer mới với cấu hình tối ưu
const optimizedObserver = new MutationObserver(optimizedMutationCallback);

// Thêm cơ chế tự làm mới cache để tránh rò rỉ bộ nhớ
function cleanupCache() {
    // Giới hạn kích thước cache để tránh sử dụng quá nhiều bộ nhớ
    const MAX_CACHE_ENTRIES = 100;

    // Làm sạch mediaCache
    if (mediaCache && Object.keys(mediaCache).length > MAX_CACHE_ENTRIES) {
        console.log('Cleaning up media cache');
        // Lấy các khóa để xóa (giữ lại 80% mới nhất)
        const keysToKeep = Object.keys(mediaCache)
            .slice(-Math.floor(MAX_CACHE_ENTRIES * 0.8));

        // Tạo cache mới với các mục cần giữ lại
        const newCache = {};
        keysToKeep.forEach(key => {
            newCache[key] = mediaCache[key];
        });

        // Thay thế cache cũ
        mediaCache = newCache;
    }

    // Làm sạch postIdCache
    if (postIdCache && Object.keys(postIdCache).length > MAX_CACHE_ENTRIES) {
        console.log('Cleaning up postId cache');
        // Lấy các khóa để xóa (giữ lại 80% mới nhất)
        const keysToKeep = Object.keys(postIdCache)
            .slice(-Math.floor(MAX_CACHE_ENTRIES * 0.8));

        // Tạo cache mới với các mục cần giữ lại
        const newCache = {};
        keysToKeep.forEach(key => {
            newCache[key] = postIdCache[key];
        });

        // Thay thế cache cũ
        postIdCache = newCache;
    }
}

// Thiết lập làm sạch cache định kỳ
setInterval(cleanupCache, 5 * 60 * 1000); // Mỗi 5 phút

// Bắt đầu quan sát DOM và thay thế observer cũ
function initializeOptimizedObserver() {
    // Tham chiếu đến observer hiện tại từ mã gốc (đã được định nghĩa trước đó)
    if (typeof observer !== 'undefined') {
        // Ngắt kết nối observer cũ
        observer.disconnect();
        console.log('Original observer disconnected');
    }

    // Xử lý các phần tử media đã có trên trang trước khi bắt đầu quan sát
    const existingMedia = document.querySelectorAll('img:not([data-ig-processed]), video:not([data-ig-processed])');
    existingMedia.forEach(element => {
        if (shouldProcessMediaElement(element)) {
            mediaElementsToProcess.add(element);
        }
    });

    // Xử lý ngay lập tức các phần tử đã có
    if (mediaElementsToProcess.size > 0) {
        throttledProcessMediaElements();
    }

    // Bắt đầu quan sát DOM với observer mới
    optimizedObserver.observe(document.body, optimizedObserverConfig);

    console.log('Optimized mutation observer started');
}

// Đảm bảo rằng chúng ta chỉ khởi tạo observer mới sau khi mã gốc đã chạy
// và biến 'observer' đã được định nghĩa
if (document.readyState === 'loading') {
    // Nếu DOM vẫn đang tải, đợi DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Đợi thêm một chút để đảm bảo mã gốc đã chạy
        setTimeout(initializeOptimizedObserver, 500);
    });
} else {
    // Nếu DOM đã sẵn sàng, đợi một khoảng thời gian ngắn và khởi tạo
    setTimeout(initializeOptimizedObserver, 500);
}

/**
 * Check if the current page is a profile page and add download button
 */
function checkForProfilePage() {
    // Profile pages match this pattern: instagram.com/username
    // But not: instagram.com/p/..., instagram.com/stories/..., instagram.com/explore/...
    const isProfilePage = /instagram\.com\/(?!p\/|stories\/|explore\/)[^\/]+\/?$/.test(location.href);

    if (isProfilePage && !isProcessingProfile) {
        addProfileDownloadButton();
    }
}

/**
 * Add a download button to profile pages
 */
function addProfileDownloadButton() {
    // Check if button already exists
    if (document.querySelector('.violet_toolkit_profile_download_btn')) {
        return;
    }

    // Try to find header section or appropriate container for the button
    const header = document.querySelector('header section') ||
        document.querySelector('header') ||
        document.querySelector('section main header');

    if (!header) return;

    // Create profile download button
    const downloadBtn = document.createElement('div');
    downloadBtn.className = 'violet_toolkit_profile_download_btn';
    downloadBtn.innerHTML = `
        <span class="violet_toolkit_icon"></span>
        <span class="violet_toolkit_text">Download All</span>
    `;
    downloadBtn.style.cssText = `
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #0095f6;
        color: white;
        border-radius: 4px;
        margin-top: 12px;
        font-weight: bold;
    `;

    // Add click handler
    downloadBtn.addEventListener('click', handleProfileDownload);

    // Add to page
    header.appendChild(downloadBtn);
}






function fetchFallbackPosts(username, csrfToken) {
    return new Promise((resolve, reject) => {
        // First try to load profile page to extract some initial posts
        fetch(`https://www.instagram.com/${username}/`, {
            method: 'GET',
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml",
                "User-Agent": navigator.userAgent
            }
        })
            .then(response => response.text())
            .then(html => {
                const posts = [];

                // Look for post shortcodes in the HTML
                const shortcodes = Array.from(
                    new Set(html.match(/\/p\/([^\/]+)\//g) || [])
                ).map(path => path.split('/p/')[1].replace('/', ''));

                if (shortcodes.length === 0) {
                    return resolve([]);
                }

                // Process each post in sequence to avoid rate limiting
                const processNextPost = (index) => {
                    if (index >= shortcodes.length) {
                        return resolve(posts);
                    }

                    const shortcode = shortcodes[index];

                    // Convert shortcode to media ID
                    const mediaId = codetopk(shortcode);
                    if (!mediaId) {
                        return processNextPost(index + 1);
                    }

                    // Fetch post details
                    fetch(`https://www.instagram.com/api/v1/media/${mediaId}/info/`, {
                        method: 'GET',
                        headers: {
                            "x-instagram-ajax": "1016349901",
                            "x-asbd-id": "129477",
                            "x-ig-app-id": "936619743392459",
                            "x-requested-with": "XMLHttpRequest",
                            "x-csrftoken": csrfToken
                        }
                    })
                        .then(response => response.json())
                        .then(json => {
                            if (json.items && json.items.length > 0) {
                                const item = json.items[0];

                                // Helper function to process a media item
                                const processMediaItem = (media) => {
                                    return {
                                        id: media.pk || media.id,
                                        shortcode: media.code,
                                        display_url: getBestImageUrl(media.image_versions2.candidates),
                                        is_video: !!media.video_versions,
                                        video_url: media.video_versions ? media.video_versions[0].url : null
                                    };
                                };

                                if (item.carousel_media) {
                                    // Process carousel post
                                    const post = {
                                        id: item.pk || item.id,
                                        shortcode: item.code,
                                        is_carousel: true,
                                        carousel_items: item.carousel_media.map(processMediaItem)
                                    };
                                    posts.push(post);
                                } else {
                                    // Process single media post
                                    posts.push(processMediaItem(item));
                                }
                            }

                            // Process next post after a small delay
                            setTimeout(() => processNextPost(index + 1), 300);
                        })
                        .catch(error => {
                            console.error(`Error fetching post ${shortcode}:`, error);
                            processNextPost(index + 1);
                        });
                };

                // Start processing posts
                processNextPost(0);
            })
            .catch(error => {
                console.error("Error in fallback post fetch:", error);
                resolve([]); // Return empty array on failure
            });
    });
}


/**
 * Alternative approach to extract posts from page HTML/JSON
 */
function extractPostsFromPage() {
    // Try to find shared data script
    const scripts = document.querySelectorAll('script[type="text/javascript"]');
    for (const script of scripts) {
        if (script.textContent.includes('window._sharedData = ')) {
            try {
                const match = script.textContent.match(/window\._sharedData = (.+);/);
                if (match && match[1]) {
                    const data = JSON.parse(match[1]);

                    // Look for profile data
                    if (data.entry_data && data.entry_data.ProfilePage && data.entry_data.ProfilePage[0]) {
                        const userData = data.entry_data.ProfilePage[0].graphql.user;
                        const username = userData.username;

                        if (userData.edge_owner_to_timeline_media && userData.edge_owner_to_timeline_media.edges) {
                            const posts = userData.edge_owner_to_timeline_media.edges.map(edge => {
                                const node = edge.node;
                                const post = {
                                    id: node.id,
                                    shortcode: node.shortcode,
                                    display_url: node.display_url,
                                    is_video: node.is_video,
                                    video_url: node.video_url,
                                    is_carousel: false,
                                    carousel_items: []
                                };

                                // Process carousel posts
                                if (node.edge_sidecar_to_children && node.edge_sidecar_to_children.edges) {
                                    post.is_carousel = true;
                                    post.carousel_items = node.edge_sidecar_to_children.edges.map(e => ({
                                        id: e.node.id,
                                        display_url: e.node.display_url,
                                        is_video: e.node.is_video,
                                        video_url: e.node.video_url
                                    }));
                                }

                                return post;
                            });

                            return { username, posts };
                        }
                    }
                }
            } catch (e) {
                console.error("Error extracting posts from sharedData:", e);
            }
        }
    }

    // Try other scripts that might contain media data
    for (const script of scripts) {
        if (script.textContent.includes('{"require":')) {
            try {
                // Instagram sometimes embeds JSON data directly in script tags
                const jsonMatches = script.textContent.match(/\{\"require\":.+\}/g);
                if (jsonMatches && jsonMatches.length > 0) {
                    for (const jsonText of jsonMatches) {
                        try {
                            const data = JSON.parse(jsonText);

                            // Look for user and media data in various places
                            if (data.require && Array.isArray(data.require)) {
                                for (const item of data.require) {
                                    if (Array.isArray(item) && item.length > 2 && item[0] === 'ProfilePageContainer') {
                                        // Found profile data
                                        if (item[1] && item[1].user) {
                                            const userData = item[1].user;
                                            const username = userData.username;

                                            if (userData.edge_owner_to_timeline_media && userData.edge_owner_to_timeline_media.edges) {
                                                const posts = userData.edge_owner_to_timeline_media.edges.map(edge => {
                                                    const node = edge.node;
                                                    return {
                                                        id: node.id,
                                                        shortcode: node.shortcode,
                                                        display_url: node.display_url,
                                                        is_video: node.is_video,
                                                        video_url: node.video_url,
                                                        is_carousel: !!node.edge_sidecar_to_children,
                                                        carousel_items: node.edge_sidecar_to_children ?
                                                            node.edge_sidecar_to_children.edges.map(e => ({
                                                                id: e.node.id,
                                                                display_url: e.node.display_url,
                                                                is_video: e.node.is_video,
                                                                video_url: e.node.video_url
                                                            })) : []
                                                    };
                                                });

                                                return { username, posts };
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            // Continue to next JSON match
                        }
                    }
                }
            } catch (e) {
                // Continue to next script
            }
        }
    }

    // If all else fails, try to at least extract post shortcodes from page HTML
    try {
        const html = document.documentElement.outerHTML;
        const shortcodePattern = /\"shortcode\":\"([^\"]+)\"/g;
        const shortcodes = [];
        let match;

        while ((match = shortcodePattern.exec(html)) !== null) {
            shortcodes.push(match[1]);
        }

        if (shortcodes.length > 0) {
            const username = getProfileUsername();
            if (username) {
                console.log(`Extracted ${shortcodes.length} post shortcodes from page HTML`);
                return {
                    username,
                    shortcodes,
                    // Return empty posts array as these need to be fetched individually
                    posts: []
                };
            }
        }
    } catch (e) {
        console.error("Error extracting shortcodes from HTML:", e);
    }

    return null;
}


function fetchPostByShortcode(shortcode, csrfToken) {
    return new Promise((resolve, reject) => {
        // First convert shortcode to media ID
        const mediaId = codetopk(shortcode);
        if (!mediaId) {
            return reject(new Error("Failed to convert shortcode to media ID"));
        }

        // Then fetch media info
        fetch(`https://www.instagram.com/api/v1/media/${mediaId}/info/`, {
            method: 'GET',
            headers: {
                "x-instagram-ajax": "1016349901",
                "x-asbd-id": "129477",
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "x-csrftoken": csrfToken
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network error: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                if (!json.items || json.items.length === 0) {
                    throw new Error("No items in response");
                }

                const item = json.items[0];
                const username = item.user ? item.user.username : "";

                // Helper function to process media
                const processMedia = (media) => {
                    return {
                        id: media.pk || media.id,
                        display_url: media.image_versions2 ? getBestImageUrl(media.image_versions2.candidates) : "",
                        is_video: !!media.video_versions,
                        video_url: media.video_versions ? media.video_versions[0].url : null
                    };
                };

                // Create a post object
                const post = {
                    id: item.pk || item.id,
                    shortcode: item.code,
                    is_carousel: !!item.carousel_media,
                    carousel_items: []
                };

                // Handle carousel media
                if (item.carousel_media) {
                    post.carousel_items = item.carousel_media.map(processMedia);
                } else {
                    // Single media - add properties directly to post
                    const mediaData = processMedia(item);
                    post.display_url = mediaData.display_url;
                    post.is_video = mediaData.is_video;
                    post.video_url = mediaData.video_url;
                }

                resolve({ post, username });
            })
            .catch(reject);
    });
}


function processShortcodes(shortcodes, csrfToken) {
    return new Promise((resolve, reject) => {
        const posts = [];
        let username = "";

        // Process shortcodes sequentially to avoid rate limiting
        const processNext = (index) => {
            if (index >= shortcodes.length) {
                return resolve({ posts, username });
            }

            fetchPostByShortcode(shortcodes[index], csrfToken)
                .then(result => {
                    posts.push(result.post);
                    username = result.username || username;

                    // Process next shortcode after a delay
                    setTimeout(() => processNext(index + 1), 500);
                })
                .catch(error => {
                    console.error(`Error fetching post ${shortcodes[index]}:`, error);
                    // Continue with next shortcode even if one fails
                    setTimeout(() => processNext(index + 1), 500);
                });
        };

        // Start processing
        processNext(0);
    });
}

function fetchProfilePostsWithEarlyStopping(userId, username, csrfToken, maxPostsNeeded, buttonElement = null, after = null, allPosts = []) {
    return new Promise((resolve, reject) => {
        // Updated progress if button element exists
        if (buttonElement && allPosts.length > 0) {
            // Calculate progress percentage (20-60%)
            const baseProgress = 20;
            const progressRange = 40;
            const progressPercentage = baseProgress + Math.min(allPosts.length / maxPostsNeeded, 1) * progressRange;

            showProgressBar(buttonElement, progressPercentage, `Fetched ${allPosts.length}/${maxPostsNeeded} posts...`);
        }

        // If we already have enough posts, stop fetching
        if (allPosts.length >= maxPostsNeeded) {
            console.log(`Early stopping: Already fetched ${allPosts.length} posts, needed ${maxPostsNeeded}`);
            resolve(allPosts.slice(0, maxPostsNeeded));
            return;
        }

        // API logic
        let variablesObj;

        if (after) {
            // For pagination requests
            variablesObj = {"data":{"count":12,"include_reel_media_seen_timestamp":true,"include_relationship_info":true,"latest_besties_reel_media":true,"latest_reel_media":true},"username":username,"__relay_internal__pv__PolarisIsLoggedInrelayprovider":true,"__relay_internal__pv__PolarisShareSheetV3relayprovider":false,"first":12,"last":null,"after":after,"before":null};
        } else {
            // For initial request
            variablesObj = {
                data: {
                    count: 12,
                    include_reel_media_seen_timestamp: true,
                    include_relationship_info: true,
                    latest_besties_reel_media: true,
                    latest_reel_media: true
                },
                username: username,
                __relay_internal__pv__PolarisIsLoggedInrelayprovider: true,
                __relay_internal__pv__PolarisShareSheetV3relayprovider: false
            };
        }

        // Log the request for debugging
        console.log(`Fetching profile posts for ${username}${after ? ` with cursor: ${after}` : ''}`);

        // Determine which endpoint to use based on whether we're paginating
        const endpoint = "https://www.instagram.com/graphql/query"

        // Prepare the request
        const requestOptions = {
            method: 'POST',
            headers: {
                "x-instagram-ajax": "1016349901",
                "x-asbd-id": "129477",
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "x-csrftoken": csrfToken,
                "content-type": "application/x-www-form-urlencoded"
            },
            credentials: 'include',
            body: new URLSearchParams({
                fb_dtsg: tokendsg,
                variables: JSON.stringify(variablesObj),
                doc_id: 9750506811647048,
                fb_api_caller_class: "RelayModern",
                fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                server_timestamps: true
            }).toString()
        };

        fetch(endpoint, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                console.log("Response received:", json);

                // Extract posts from the response
                let posts = [];
                let hasNextPage = false;
                let endCursor = null;

                try {
                    // Find the media data in different possible locations
                    let mediaData = null;

                    if (json.data && json.data.user && json.data.user.edge_owner_to_timeline_media) {
                        // GraphQL query hash response format
                        mediaData = json.data.user.edge_owner_to_timeline_media;
                        hasNextPage = mediaData.page_info.has_next_page;
                        endCursor = mediaData.page_info.end_cursor;
                    } else if (json.data && json.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                        // Standard API response format
                        mediaData = json.data.xdt_api__v1__feed__user_timeline_graphql_connection;
                        hasNextPage = mediaData.page_info.has_next_page;
                        endCursor = mediaData.page_info.end_cursor;
                    }

                    if (mediaData && mediaData.edges) {
                        // Process each post
                        mediaData.edges.forEach(edge => {
                            // Handle different node structures
                            const node = edge.node.media || edge.node;

                            // Process post to extract likes and comments
                            posts.push(node);
                        });
                    }

                    console.log(`Extracted ${posts.length} posts from response`);

                    // Combine with previous posts
                    const combinedPosts = [...allPosts, ...posts];
                    console.log(`Total posts collected: ${combinedPosts.length}`);

                    // Check if we have enough posts now
                    if (combinedPosts.length >= maxPostsNeeded) {
                        console.log(`We have ${combinedPosts.length} posts, which is enough (needed ${maxPostsNeeded})`);
                        // Return only the number of posts we need
                        resolve(combinedPosts.slice(0, maxPostsNeeded));
                        return;
                    }

                    // If there are more pages and we need more posts, fetch the next page
                    if (hasNextPage && endCursor) {
                        console.log(`Found more posts. Cursor: ${endCursor}. Fetching next page...`);

                        // Wait a bit to avoid rate limiting
                        setTimeout(() => {
                            fetchProfilePostsWithEarlyStopping(userId, username, csrfToken, maxPostsNeeded, buttonElement, endCursor, combinedPosts)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        console.log(`Finished fetching posts. Total: ${combinedPosts.length}`);
                        resolve(combinedPosts);
                    }
                } catch (e) {
                    console.error("Error processing profile posts data:", e);

                    // If we have some posts, return them instead of failing
                    if (allPosts.length > 0) {
                        resolve(allPosts);
                    } else {
                        reject(e);
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching profile posts:", error);

                // If we already have some posts, return those instead of failing
                if (allPosts.length > 0) {
                    console.log(`Returning ${allPosts.length} posts that were already fetched`);
                    resolve(allPosts);
                } else {
                    reject(error);
                }
            });
    });
}

function showProgressBar(buttonElement, percentage, statusText) {
    // Create progress bar container if it doesn't exist
    if (!buttonElement.querySelector('.violet_toolkit_progress_container')) {
        buttonElement.innerHTML = `
            <div class="violet_toolkit_status">${statusText}</div>
            <div class="violet_toolkit_progress_container" style="width: 100%; height: 4px; background-color: #efefef; border-radius: 2px; margin-top: 5px; overflow: hidden;">
                <div class="violet_toolkit_progress_bar" style="width: ${percentage}%; height: 100%; background-color: #0095f6; transition: width 0.3s ease;"></div>
            </div>
        `;
    } else {
        // Update existing progress bar
        const progressBar = buttonElement.querySelector('.violet_toolkit_progress_bar');
        const statusElement = buttonElement.querySelector('.violet_toolkit_status');

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (statusElement) {
            statusElement.textContent = statusText;
        }
    }
}
function processPostData(post) {
    // Create a copy to avoid modifying the original
    const processed = {...post};

    // Extract like count from various possible locations
    processed.like_count = post.like_count ||
        (post.edge_media_preview_like && post.edge_media_preview_like.count) ||
        (post.edge_liked_by && post.edge_liked_by.count) ||
        0;

    // Extract comment count from various possible locations
    processed.comment_count = post.comment_count ||
        (post.edge_media_to_comment && post.edge_media_to_comment.count) ||
        (post.edge_media_to_parent_comment && post.edge_media_to_parent_comment.count) ||
        0;

    // Handle date info
    if (!post.taken_at && post.taken_at_timestamp) {
        processed.taken_at = post.taken_at_timestamp;
    }

    return processed;
}
function applyFilters(posts, filters) {
    console.log("Applying filters:", filters);
    console.log("Initial posts count:", posts.length);

    let filteredPosts = [...posts];

    // Apply posts range filter
    if (filters.postsRange) {
        const fromIndex = Math.max(0, (filters.postsRange.from || 1) - 1);
        const toIndex = Math.min(posts.length - 1, (filters.postsRange.to || posts.length) - 1);

        filteredPosts = filteredPosts.slice(fromIndex, toIndex + 1);
        console.log(`After range filter (${fromIndex+1} to ${toIndex+1}):`, filteredPosts.length);
    }

    // Apply likes filter
    if (filters.likes && (filters.likes.min !== null || filters.likes.max !== null)) {
        const minLikes = filters.likes.min !== null ? parseInt(filters.likes.min) : 0;
        const maxLikes = filters.likes.max !== null ? parseInt(filters.likes.max) : Infinity;

        filteredPosts = filteredPosts.filter(post => {
            const likeCount = post.like_count || 0;
            return likeCount >= minLikes && likeCount <= maxLikes;
        });

        console.log(`After likes filter (${minLikes}-${maxLikes}):`, filteredPosts.length);
    }

    // Apply comments filter
    if (filters.comments && (filters.comments.min !== null || filters.comments.max !== null)) {
        const minComments = filters.comments.min !== null ? parseInt(filters.comments.min) : 0;
        const maxComments = filters.comments.max !== null ? parseInt(filters.comments.max) : Infinity;

        filteredPosts = filteredPosts.filter(post => {
            const commentCount = post.comment_count || 0;
            return commentCount >= minComments && commentCount <= maxComments;
        });

        console.log(`After comments filter (${minComments}-${maxComments}):`, filteredPosts.length);
    }

    // Apply date filter
    if (filters.date && (filters.date.from || filters.date.to)) {
        filteredPosts = filteredPosts.filter(post => {
            if (!post.taken_at) return true; // Skip if no date

            const postTimestamp = post.taken_at * 1000; // Convert to milliseconds
            const postDate = new Date(postTimestamp);

            if (filters.date.from) {
                const fromDate = new Date(filters.date.from);
                if (postDate < fromDate) return false;
            }

            if (filters.date.to) {
                const toDate = new Date(filters.date.to);
                // Add one day to include the end date fully
                toDate.setDate(toDate.getDate() + 1);
                if (postDate > toDate) return false;
            }

            return true;
        });

        console.log(`After date filter:`, filteredPosts.length);
    }

    // Apply sorting and top posts filters
    if (filters.sorting) {
        // Sort by most likes if requested
        if (filters.sorting.mostLikes !== null) {
            // Sort posts by like count (descending)
            filteredPosts.sort((a, b) => {
                const likesA = a.like_count || 0;
                const likesB = b.like_count || 0;
                return likesB - likesA; // Descending order
            });

            // Take only the top N posts with most likes
            filteredPosts = filteredPosts.slice(0, filters.sorting.mostLikes);
            console.log(`After most likes filter (top ${filters.sorting.mostLikes}):`, filteredPosts.length);
        }

        // Sort by most comments if requested
        if (filters.sorting.mostComments !== null) {
            // If we already filtered by likes, we need to respect that
            if (filters.sorting.mostLikes !== null) {
                console.log("Keeping likes sorting and adding comments filter");
                // Keep current filtering (by likes) but ensure we have enough posts
                const topLikesPosts = [...filteredPosts];

                // Get original posts filtered by everything except likes sorting
                let tempPosts = [...posts];

                // Apply range filter
                if (filters.postsRange) {
                    const fromIndex = Math.max(0, (filters.postsRange.from || 1) - 1);
                    const toIndex = Math.min(posts.length - 1, (filters.postsRange.to || posts.length) - 1);
                    tempPosts = tempPosts.slice(fromIndex, toIndex + 1);
                }

                // Apply likes min/max filter (not sorting)
                if (filters.likes && (filters.likes.min !== null || filters.likes.max !== null)) {
                    const minLikes = filters.likes.min !== null ? parseInt(filters.likes.min) : 0;
                    const maxLikes = filters.likes.max !== null ? parseInt(filters.likes.max) : Infinity;

                    tempPosts = tempPosts.filter(post => {
                        const likeCount = post.like_count || 0;
                        return likeCount >= minLikes && likeCount <= maxLikes;
                    });
                }

                // Apply comments filter
                if (filters.comments && (filters.comments.min !== null || filters.comments.max !== null)) {
                    const minComments = filters.comments.min !== null ? parseInt(filters.comments.min) : 0;
                    const maxComments = filters.comments.max !== null ? parseInt(filters.comments.max) : Infinity;

                    tempPosts = tempPosts.filter(post => {
                        const commentCount = post.comment_count || 0;
                        return commentCount >= minComments && commentCount <= maxComments;
                    });
                }

                // Apply date filter
                if (filters.date && (filters.date.from || filters.date.to)) {
                    tempPosts = tempPosts.filter(post => {
                        if (!post.taken_at) return true;

                        const postTimestamp = post.taken_at * 1000;
                        const postDate = new Date(postTimestamp);

                        if (filters.date.from) {
                            const fromDate = new Date(filters.date.from);
                            if (postDate < fromDate) return false;
                        }

                        if (filters.date.to) {
                            const toDate = new Date(filters.date.to);
                            toDate.setDate(toDate.getDate() + 1);
                            if (postDate > toDate) return false;
                        }

                        return true;
                    });
                }

                // Now sort tempPosts by comments
                tempPosts.sort((a, b) => {
                    const commentsA = a.comment_count || 0;
                    const commentsB = b.comment_count || 0;
                    return commentsB - commentsA;
                });

                // Take top N by comments
                const topCommentsPosts = tempPosts.slice(0, filters.sorting.mostComments);

                // Merge the two sets (prioritizing posts that are in both sets)
                const postIds = new Set();
                const mergedPosts = [];

                // First add posts that are in both sets (high likes and high comments)
                for (const likePost of topLikesPosts) {
                    if (topCommentsPosts.some(commentPost => commentPost.id === likePost.id)) {
                        mergedPosts.push(likePost);
                        postIds.add(likePost.id);
                    }
                }

                // Then add remaining posts from likes set
                for (const likePost of topLikesPosts) {
                    if (!postIds.has(likePost.id)) {
                        mergedPosts.push(likePost);
                        postIds.add(likePost.id);
                    }
                }

                // Then add remaining posts from comments set
                for (const commentPost of topCommentsPosts) {
                    if (!postIds.has(commentPost.id)) {
                        mergedPosts.push(commentPost);
                        postIds.add(commentPost.id);
                    }
                }

                // Limit to the max of the two limits to keep result set reasonable
                const limit = Math.max(filters.sorting.mostLikes, filters.sorting.mostComments);
                filteredPosts = mergedPosts.slice(0, limit);

                console.log(`After merging top likes and top comments:`, filteredPosts.length);
            } else {
                // Just sort by comments
                filteredPosts.sort((a, b) => {
                    const commentsA = a.comment_count || 0;
                    const commentsB = b.comment_count || 0;
                    return commentsB - commentsA; // Descending order
                });

                // Take only the top N posts with most comments
                filteredPosts = filteredPosts.slice(0, filters.sorting.mostComments);
                console.log(`After most comments filter (top ${filters.sorting.mostComments}):`, filteredPosts.length);
            }
        }
    }

    return filteredPosts;
}

// Function to create and show a filter popup with post count
function showFilterPopup(buttonElement, username, totalPosts) {
    // Create the popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'violet_toolkit_overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
    overlay.style.zIndex = '9998';
    document.body.appendChild(overlay);

    // Create the popup container
    const popup = document.createElement('div');
    popup.className = 'violet_toolkit_popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.borderRadius = '12px';
    popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    popup.style.padding = '20px';
    popup.style.zIndex = '9999';
    popup.style.width = '350px';
    popup.style.maxWidth = '90%';
    popup.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    // Popup header
    const header = document.createElement('div');
    header.className = 'violet_toolkit_popup_header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '15px';
    header.style.borderBottom = '1px solid #efefef';
    header.style.paddingBottom = '10px';

    const title = document.createElement('span');
    title.className = 'violet_toolkit_popup_title';
    title.style.fontWeight = '600';
    title.style.fontSize = '16px';
    title.textContent = 'Zework.com download all';

    const closeButton = document.createElement('span');
    closeButton.className = 'violet_toolkit_popup_close';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.color = '#8e8e8e';
    closeButton.textContent = '×';
    closeButton.onclick = function() {
        closeFilterPopup();
        isProcessingProfile = false;
    };

    header.appendChild(title);
    header.appendChild(closeButton);
    popup.appendChild(header);

    // Posts info header
    const postsInfoHeader = document.createElement('div');
    postsInfoHeader.className = 'violet_toolkit_posts_info';
    postsInfoHeader.style.marginBottom = '15px';
    postsInfoHeader.style.textAlign = 'center';
    postsInfoHeader.style.padding = '8px';
    postsInfoHeader.style.backgroundColor = '#f9f9f9';
    postsInfoHeader.style.borderRadius = '4px';
    postsInfoHeader.style.fontSize = '14px';

    postsInfoHeader.innerHTML = `<span class="violet_toolkit_posts_count">${totalPosts}</span> posts available for download`;
    popup.appendChild(postsInfoHeader);

    // Posts range filter
    const postsRangeGroup = document.createElement('div');
    postsRangeGroup.className = 'violet_toolkit_filter_group';
    postsRangeGroup.style.marginBottom = '20px';
    postsRangeGroup.style.backgroundColor = '#edf9ff';
    postsRangeGroup.style.padding = '10px';
    postsRangeGroup.style.borderRadius = '4px';

    const postsRangeLabel = document.createElement('label');
    postsRangeLabel.className = 'violet_toolkit_filter_label';
    postsRangeLabel.style.display = 'block';
    postsRangeLabel.style.fontWeight = '500';
    postsRangeLabel.style.marginBottom = '10px';
    postsRangeLabel.style.fontSize = '14px';
    postsRangeLabel.textContent = 'Download posts range:';

    const postsRangeContainer = document.createElement('div');
    postsRangeContainer.className = 'violet_toolkit_range_container';
    postsRangeContainer.style.display = 'flex';
    postsRangeContainer.style.gap = '10px';
    postsRangeContainer.style.alignItems = 'center';

    const postsRangeFrom = document.createElement('input');
    postsRangeFrom.className = 'violet_toolkit_input posts_from';
    postsRangeFrom.style.width = '70px';
    postsRangeFrom.style.border = '1px solid #dbdbdb';
    postsRangeFrom.style.borderRadius = '4px';
    postsRangeFrom.style.padding = '8px 10px';
    postsRangeFrom.style.fontSize = '14px';
    postsRangeFrom.style.textAlign = 'center';
    postsRangeFrom.type = 'number';
    postsRangeFrom.min = '1';
    postsRangeFrom.max = totalPosts.toString();
    postsRangeFrom.value = '1';

    const postsRangeTo = document.createElement('input');
    postsRangeTo.className = 'violet_toolkit_input posts_to';
    postsRangeTo.style.width = '70px';
    postsRangeTo.style.border = '1px solid #dbdbdb';
    postsRangeTo.style.borderRadius = '4px';
    postsRangeTo.style.padding = '8px 10px';
    postsRangeTo.style.fontSize = '14px';
    postsRangeTo.style.textAlign = 'center';
    postsRangeTo.type = 'number';
    postsRangeTo.min = '1';
    postsRangeTo.max = totalPosts.toString();
    postsRangeTo.value = Math.min(totalPosts, 20).toString(); // Default to download first 20 posts or all if less

    const rangeText = document.createElement('div');
    rangeText.style.flex = '1';
    rangeText.style.textAlign = 'center';
    rangeText.textContent = 'to';

    postsRangeContainer.appendChild(postsRangeFrom);
    postsRangeContainer.appendChild(rangeText);
    postsRangeContainer.appendChild(postsRangeTo);

    postsRangeGroup.appendChild(postsRangeLabel);
    postsRangeGroup.appendChild(postsRangeContainer);
    popup.appendChild(postsRangeGroup);

    // Add event listeners to validate range inputs
    postsRangeFrom.addEventListener('change', () => {
        // Ensure "from" is not greater than "to"
        const fromVal = parseInt(postsRangeFrom.value);
        const toVal = parseInt(postsRangeTo.value);

        if (fromVal < 1) postsRangeFrom.value = '1';
        if (fromVal > totalPosts) postsRangeFrom.value = totalPosts.toString();
        if (fromVal > toVal) postsRangeTo.value = postsRangeFrom.value;
    });

    postsRangeTo.addEventListener('change', () => {
        // Ensure "to" is not less than "from"
        const fromVal = parseInt(postsRangeFrom.value);
        const toVal = parseInt(postsRangeTo.value);

        if (toVal < 1) postsRangeTo.value = '1';
        if (toVal > totalPosts) postsRangeTo.value = totalPosts.toString();
        if (toVal < fromVal) postsRangeFrom.value = postsRangeTo.value;
    });

    // Section separator after posts range
    const separator1 = document.createElement('div');
    separator1.style.borderTop = '1px solid #efefef';
    separator1.style.margin = '10px 0 20px';
    popup.appendChild(separator1);

    // Sorting options section
    const topPostsGroup = document.createElement('div');
    topPostsGroup.className = 'violet_toolkit_filter_group';
    topPostsGroup.style.marginBottom = '20px';
    topPostsGroup.style.backgroundColor = '#fff0f5';
    topPostsGroup.style.padding = '10px';
    topPostsGroup.style.borderRadius = '4px';

    const topPostsLabel = document.createElement('label');
    topPostsLabel.className = 'violet_toolkit_filter_label';
    topPostsLabel.style.display = 'block';
    topPostsLabel.style.fontWeight = '500';
    topPostsLabel.style.marginBottom = '10px';
    topPostsLabel.style.fontSize = '14px';
    topPostsLabel.textContent = 'Sort and select top posts:';

    topPostsGroup.appendChild(topPostsLabel);

    // Create checkboxes for most likes and most comments
    const mostLikesContainer = document.createElement('div');
    mostLikesContainer.style.display = 'flex';
    mostLikesContainer.style.alignItems = 'center';
    mostLikesContainer.style.marginBottom = '8px';

    const mostLikesCheckbox = document.createElement('input');
    mostLikesCheckbox.type = 'checkbox';
    mostLikesCheckbox.id = 'most_likes_checkbox';
    mostLikesCheckbox.style.marginRight = '8px';

    const mostLikesLabel = document.createElement('label');
    mostLikesLabel.htmlFor = 'most_likes_checkbox';
    mostLikesLabel.textContent = 'Download by top LIKE';
    mostLikesLabel.style.fontSize = '14px';
    mostLikesLabel.style.flex = '1';

    const mostLikesCount = document.createElement('input');
    mostLikesCount.type = 'number';
    mostLikesCount.min = '1';
    mostLikesCount.value = '3';
    mostLikesCount.style.width = '60px';
    mostLikesCount.style.border = '1px solid #dbdbdb';
    mostLikesCount.style.borderRadius = '4px';
    mostLikesCount.style.padding = '5px';
    mostLikesCount.style.textAlign = 'center';
    mostLikesCount.disabled = true;

    mostLikesCheckbox.addEventListener('change', function() {
        mostLikesCount.disabled = !this.checked;
    });

    mostLikesContainer.appendChild(mostLikesCheckbox);
    mostLikesContainer.appendChild(mostLikesLabel);
    mostLikesContainer.appendChild(mostLikesCount);

    // Most comments container
    const mostCommentsContainer = document.createElement('div');
    mostCommentsContainer.style.display = 'flex';
    mostCommentsContainer.style.alignItems = 'center';

    const mostCommentsCheckbox = document.createElement('input');
    mostCommentsCheckbox.type = 'checkbox';
    mostCommentsCheckbox.id = 'most_comments_checkbox';
    mostCommentsCheckbox.style.marginRight = '8px';

    const mostCommentsLabel = document.createElement('label');
    mostCommentsLabel.htmlFor = 'most_comments_checkbox';
    mostCommentsLabel.textContent = 'Download by top CMT ';
    mostCommentsLabel.style.fontSize = '14px';
    mostCommentsLabel.style.flex = '1';

    const mostCommentsCount = document.createElement('input');
    mostCommentsCount.type = 'number';
    mostCommentsCount.min = '1';
    mostCommentsCount.value = '3';
    mostCommentsCount.style.width = '60px';
    mostCommentsCount.style.border = '1px solid #dbdbdb';
    mostCommentsCount.style.borderRadius = '4px';
    mostCommentsCount.style.padding = '5px';
    mostCommentsCount.style.textAlign = 'center';
    mostCommentsCount.disabled = true;

    mostCommentsCheckbox.addEventListener('change', function() {
        mostCommentsCount.disabled = !this.checked;
    });

    mostCommentsContainer.appendChild(mostCommentsCheckbox);
    mostCommentsContainer.appendChild(mostCommentsLabel);
    mostCommentsContainer.appendChild(mostCommentsCount);

    topPostsGroup.appendChild(mostLikesContainer);
    topPostsGroup.appendChild(mostCommentsContainer);
    popup.appendChild(topPostsGroup);

    // Section separator for additional filters
    const separator2 = document.createElement('div');
    separator2.style.borderTop = '1px solid #efefef';
    separator2.style.margin = '10px 0 20px';
    popup.appendChild(separator2);

    // Filter section title
    const filterSectionTitle = document.createElement('div');
    filterSectionTitle.textContent = 'Additional filters';
    filterSectionTitle.style.fontSize = '15px';
    filterSectionTitle.style.fontWeight = '600';
    filterSectionTitle.style.marginBottom = '15px';
    popup.appendChild(filterSectionTitle);

    // Likes range filter
    const likesGroup = document.createElement('div');
    likesGroup.className = 'violet_toolkit_filter_group';
    likesGroup.style.marginBottom = '15px';

    const likesLabel = document.createElement('label');
    likesLabel.className = 'violet_toolkit_filter_label';
    likesLabel.style.display = 'block';
    likesLabel.style.fontWeight = '500';
    likesLabel.style.marginBottom = '5px';
    likesLabel.style.fontSize = '14px';
    likesLabel.textContent = 'Likes Range:';

    const likesContainer = document.createElement('div');
    likesContainer.className = 'violet_toolkit_range_container';
    likesContainer.style.display = 'flex';
    likesContainer.style.gap = '10px';
    likesContainer.style.alignItems = 'center';

    const likesMin = document.createElement('input');
    likesMin.className = 'violet_toolkit_input likes_min';
    likesMin.style.flex = '1';
    likesMin.style.border = '1px solid #dbdbdb';
    likesMin.style.borderRadius = '4px';
    likesMin.style.padding = '8px 10px';
    likesMin.style.fontSize = '14px';
    likesMin.style.textAlign = 'center';
    likesMin.type = 'number';
    likesMin.style.width = '1px';
    likesMin.placeholder = 'Min';
    likesMin.min = '0';

    const likesMax = document.createElement('input');
    likesMax.className = 'violet_toolkit_input likes_max';
    likesMax.style.flex = '1';
    likesMax.style.border = '1px solid #dbdbdb';
    likesMax.style.borderRadius = '4px';
    likesMax.style.padding = '8px 10px';
    likesMax.style.width = '1px';
    likesMax.style.fontSize = '14px';
    likesMax.style.textAlign = 'center';
    likesMax.type = 'number';
    likesMax.placeholder = 'Max';
    likesMax.min = '0';

    const likesText = document.createElement('div');
    likesText.style.flex = '0.5';
    likesText.style.textAlign = 'center';
    likesText.textContent = 'to';

    likesContainer.appendChild(likesMin);
    likesContainer.appendChild(likesText);
    likesContainer.appendChild(likesMax);

    likesGroup.appendChild(likesLabel);
    likesGroup.appendChild(likesContainer);
    popup.appendChild(likesGroup);

    // Comments range filter
    const commentsGroup = document.createElement('div');
    commentsGroup.className = 'violet_toolkit_filter_group';
    commentsGroup.style.marginBottom = '15px';

    const commentsLabel = document.createElement('label');
    commentsLabel.className = 'violet_toolkit_filter_label';
    commentsLabel.style.display = 'block';
    commentsLabel.style.fontWeight = '500';
    commentsLabel.style.marginBottom = '5px';
    commentsLabel.style.fontSize = '14px';
    commentsLabel.textContent = 'Comments Range:';

    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'violet_toolkit_range_container';
    commentsContainer.style.display = 'flex';
    commentsContainer.style.gap = '10px';
    commentsContainer.style.alignItems = 'center';

    const commentsMin = document.createElement('input');
    commentsMin.className = 'violet_toolkit_input comments_min';
    commentsMin.style.flex = '1';
    commentsMin.style.border = '1px solid #dbdbdb';
    commentsMin.style.borderRadius = '4px';
    commentsMin.style.padding = '8px 10px';
    commentsMin.style.fontSize = '14px';
    commentsMin.style.textAlign = 'center';
    commentsMin.type = 'number';
    commentsMin.style.width = '1px';
    commentsMin.placeholder = 'Min';
    commentsMin.min = '0';

    const commentsMax = document.createElement('input');
    commentsMax.className = 'violet_toolkit_input comments_max';
    commentsMax.style.flex = '1';
    commentsMax.style.border = '1px solid #dbdbdb';
    commentsMax.style.borderRadius = '4px';
    commentsMax.style.padding = '8px 10px';
    commentsMax.style.fontSize = '14px';
    commentsMax.style.textAlign = 'center';
    commentsMax.type = 'number';
    commentsMax.placeholder = 'Max';
    commentsMax.style.width = '1px';
    commentsMax.min = '0';

    const commentsText = document.createElement('div');
    commentsText.style.flex = '0.5';
    commentsText.style.textAlign = 'center';
    commentsText.textContent = 'to';

    commentsContainer.appendChild(commentsMin);
    commentsContainer.appendChild(commentsText);
    commentsContainer.appendChild(commentsMax);

    commentsGroup.appendChild(commentsLabel);
    commentsGroup.appendChild(commentsContainer);
    popup.appendChild(commentsGroup);

    // Date range filter
    const dateGroup = document.createElement('div');
    dateGroup.className = 'violet_toolkit_filter_group';
    dateGroup.style.marginBottom = '15px';

    const dateLabel = document.createElement('label');
    dateLabel.className = 'violet_toolkit_filter_label';
    dateLabel.style.display = 'block';
    dateLabel.style.fontWeight = '500';
    dateLabel.style.marginBottom = '5px';
    dateLabel.style.fontSize = '14px';
    dateLabel.textContent = 'Date Range:';

    const dateContainer = document.createElement('div');
    dateContainer.className = 'violet_toolkit_range_container';
    dateContainer.style.display = 'flex';
    dateContainer.style.gap = '10px';
    dateContainer.style.alignItems = 'center';

    const dateFrom = document.createElement('input');
    dateFrom.className = 'violet_toolkit_date_input date_from';
    dateFrom.style.flex = '1';
    dateFrom.style.border = '1px solid #dbdbdb';
    dateFrom.style.borderRadius = '4px';
    dateFrom.style.padding = '8px 10px';
    dateFrom.style.fontSize = '14px';
    dateFrom.type = 'date';

    const dateTo = document.createElement('input');
    dateTo.className = 'violet_toolkit_date_input date_to';
    dateTo.style.flex = '1';
    dateTo.style.border = '1px solid #dbdbdb';
    dateTo.style.borderRadius = '4px';
    dateTo.style.padding = '8px 10px';
    dateTo.style.fontSize = '14px';
    dateTo.type = 'date';

    // Set default date range (last 30 days)
    const today = new Date();


    dateTo.valueAsDate = today;


    const dateText = document.createElement('div');
    dateText.style.flex = '0.5';
    dateText.style.textAlign = 'center';
    dateText.textContent = 'to';

    dateContainer.appendChild(dateFrom);
    dateContainer.appendChild(dateText);
    dateContainer.appendChild(dateTo);

    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateContainer);
    popup.appendChild(dateGroup);

    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'violet_toolkit_popup_buttons';
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'flex-end';
    buttonsContainer.style.gap = '10px';
    buttonsContainer.style.marginTop = '20px';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'violet_toolkit_button violet_toolkit_button_cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.fontWeight = '600';
    cancelButton.style.fontSize = '14px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.backgroundColor = '#efefef';
    cancelButton.style.color = '#262626';
    cancelButton.style.border = 'none';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function() {
        closeFilterPopup();
        isProcessingProfile = false;
    };

    const applyButton = document.createElement('button');
    applyButton.className = 'violet_toolkit_button violet_toolkit_button_apply';
    applyButton.style.padding = '8px 16px';
    applyButton.style.borderRadius = '4px';
    applyButton.style.fontWeight = '600';
    applyButton.style.fontSize = '14px';
    applyButton.style.cursor = 'pointer';
    applyButton.style.backgroundColor = '#0095f6';
    applyButton.style.color = 'white';
    applyButton.style.border = 'none';
    applyButton.textContent = 'Download';
    applyButton.onclick = () => {
        // Set processing flag back to true
        isProcessingProfile = true;

        // Get filter values
        const filters = {
            postsRange: {
                from: parseInt(postsRangeFrom.value),
                to: parseInt(postsRangeTo.value)
            },
            likes: {
                min: likesMin.value ? parseInt(likesMin.value) : null,
                max: likesMax.value ? parseInt(likesMax.value) : null
            },
            comments: {
                min: commentsMin.value ? parseInt(commentsMin.value) : null,
                max: commentsMax.value ? parseInt(commentsMax.value) : null
            },
            date: {
                from: dateFrom.value ? dateFrom.value : null,
                to: dateTo.value ? dateTo.value : null
            },
            sorting: {
                mostLikes: mostLikesCheckbox.checked ? parseInt(mostLikesCount.value) : null,
                mostComments: mostCommentsCheckbox.checked ? parseInt(mostCommentsCount.value) : null
            }
        };

        // Close popup
        closeFilterPopup();

        // Store filters in local storage for later use
        localStorage.setItem('violet_toolkit_filters', JSON.stringify(filters));
        sessionStorage.setItem('violet_toolkit_filters', JSON.stringify(filters));

        // Update button to show initial progress
        showProgressBar(buttonElement, 0, "Preparing download...");

        // Call the download function with filters
        fetchProfilePostsViaAPI();
    };

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(applyButton);
    popup.appendChild(buttonsContainer);

    // Add popup to document
    document.body.appendChild(popup);
}

// Function to close the filter popup
function closeFilterPopup() {
    const overlay = document.querySelector('.violet_toolkit_overlay');
    const popup = document.querySelector('.violet_toolkit_popup');

    if (overlay) overlay.remove();
    if (popup) popup.remove();
}
function handleDownloadProgress(progressData) {
    // Tìm các nút tải xuống đang hoạt động
    const downloadButton = document.querySelector('.violet_toolkit_profile_download_btn');
    if (!downloadButton) return;

    // Tính toán phần trăm tiến trình
    const percentage = Math.round((progressData.current / progressData.total) * 100);

    // Hiển thị tiến trình
    showProgressBar(downloadButton, percentage,
        `Downloading ${progressData.current}/${progressData.total} files (${percentage}%)`);

    // Khi hoàn thành
    if (progressData.current >= progressData.total) {
        setTimeout(() => {
            showProgressBar(downloadButton, 100, "Download Complete!");

            // Đặt lại nút sau 3 giây
            setTimeout(() => {
                downloadButton.innerHTML = `
                    <span class="violet_toolkit_icon"></span>
                    <span class="violet_toolkit_text">Download All</span>
                `;
                isProcessingProfile = false;
            }, 3000);
        }, 500);
    }
}
// Intercept the message system to apply filters
const originalAddListener = chrome.runtime.onMessage.addListener;
chrome.runtime.onMessage.addListener = function(request, sender, sendResponse) {

    if (request.downloadProgress) {
        handleDownloadProgress(request.downloadProgress);
        sendResponse({status: "Progress update received"});
        return true;
    }
    // If this is a profile download request with posts data
    if (request && request.profileDownload && request.posts && Array.isArray(request.posts)) {
        // Get filters from localStorage or sessionStorage
        const filtersJson = localStorage.getItem('violet_toolkit_filters') ||
            sessionStorage.getItem('violet_toolkit_filters');

        if (filtersJson) {
            try {
                // Parse the filters
                const filters = JSON.parse(filtersJson);
                console.log('Applying filters:', filters);

                // Get the original posts
                const originalPosts = request.posts;

                // Posts are already in the correct format for downloading, but we need to filter them
                // Create a temporary array with index information
                const indexedPosts = originalPosts.map((post, index) => ({
                    ...post,
                    _index: index + 1  // 1-based index for range filtering
                }));

                // Filter the posts by post range
                let filteredPosts = indexedPosts;

                if (filters.postsRange) {
                    filteredPosts = filteredPosts.filter(post =>
                        post._index >= filters.postsRange.from &&
                        post._index <= filters.postsRange.to
                    );
                }

                // Apply other filters if applicable
                // Note: This part depends on your data structure and needs to be customized
                // For likes, comments, date filters

                // Remove the temporary index property
                filteredPosts = filteredPosts.map(post => {
                    const { _index, ...rest } = post;
                    return rest;
                });

                // Update the request object with filtered posts
                request.posts = filteredPosts;

                console.log(`Filtered posts: ${filteredPosts.length} of ${originalPosts.length}`);

                // Clear the filters from storage since we've applied them
                localStorage.removeItem('violet_toolkit_filters');
                sessionStorage.removeItem('violet_toolkit_filters');
            } catch (e) {
                console.error('Error applying filters:', e);
            }
        }
    }

    // Call the original listener
    return originalAddListener.apply(chrome.runtime, arguments);
};

// Store the original handleProfileDownload function reference
const originalHandleProfileDownload = handleProfileDownload;


function getUserPostCount(username) {
    return new Promise((resolve, reject) => {
        // Get CSRF token
        const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
        const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

        // Fetch user profile to get post count
        fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
            method: 'GET',
            headers: {
                "x-instagram-ajax": "1016349901",
                "x-asbd-id": "129477",
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "x-csrftoken": csrfToken
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.data && json.data.user && json.data.user.edge_owner_to_timeline_media &&
                    json.data.user.edge_owner_to_timeline_media.count !== undefined) {
                    const postCount = json.data.user.edge_owner_to_timeline_media.count;
                    resolve(postCount);
                } else {
                    console.log("Could not find post count in API response", json);
                    reject(new Error("Could not find post count"));
                }
            })
            .catch(error => {
                console.error("Error fetching post count:", error);
                reject(error);
            });
    });
}
/**
 * Handle click on profile download button
 */
function handleProfileDownload() {
    if (isProcessingProfile) return;
    isProcessingProfile = true;

    // Get username from URL
    const username = getProfileUsername();
    if (!username) {
        showProfileDownloadError(this, "Couldn't identify username");
        isProcessingProfile = false;
        return;
    }

    // Show loading indicator while fetching post count
    const buttonElement = this;
    buttonElement.innerHTML = `
        <span class="violet_toolkit_icon" style="animation: spin 1s linear infinite;"></span>
        <span class="violet_toolkit_text">Loading...</span>
    `;

    // Get post count using the direct API call
    getUserPostCount(username)
        .then(postCount => {
            // Reset the download button appearance
            buttonElement.innerHTML = `
                <span class="violet_toolkit_icon"></span>
                <span class="violet_toolkit_text">Download All</span>
            `;

            // Reset processing flag until user confirms download
            isProcessingProfile = false;

            // Show the filter popup with the post count
            showFilterPopup(buttonElement, username, postCount);
        })
        .catch(error => {
            console.error("Failed to get post count:", error);

            // Reset the download button appearance
            buttonElement.innerHTML = `
                <span class="violet_toolkit_icon"></span>
                <span class="violet_toolkit_text">Download All</span>
            `;

            // Reset processing flag
            isProcessingProfile = false;

            // Show popup with a default estimated count
            showFilterPopup(buttonElement, username, 50); // Default to 50 posts if we can't get the real count
        });
}

    /**
 * Get username from current URL
 */
function getProfileUsername() {
    const match = location.pathname.match(/^\/@?([^\/]+)/);
    if (match && match[1]) {
        return match[1];
    }

    // Fallback: try to get from page title or other elements
    const title = document.title.match(/@?([^•]+)/);
    if (title && title[1]) {
        return title[1].trim();
    }

    return null;
}

/**
 * Get user ID from username
 */
function getUserId(username) {
    return new Promise((resolve, reject) => {
        // Check if we already have the user ID cached
        for (let i in rangeid) {
            if (rangeid[i].pkid === username) {
                resolve(rangeid[i].userid);
                return;
            }
        }

        // Get CSRF token
        const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
        const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

        // Fetch user profile to get ID
        fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
            method: 'GET',
            headers: {
                "x-instagram-ajax": "1016349901",
                "x-asbd-id": "129477",
                "x-ig-app-id": "936619743392459",
                "x-requested-with": "XMLHttpRequest",
                "x-csrftoken": csrfToken
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.data && json.data.user && json.data.user.id) {
                    const userId = json.data.user.id;
                    rangeid.push({pkid: username, userid: userId});
                    resolve(userId);
                } else {
                    reject(new Error("Could not find user ID"));
                }
            })
            .catch(reject);
    });
}

/**
 * Fetch posts from a profile
 */
/**
 * Fetch posts from a profile
 */
    /**
     * Fetch posts from a profile with correct pagination
     */
    var usernamex=""
    function fetchProfilePosts(userId, username, csrfToken, after = null, allPosts = []) {
        usernamex=username
        return new Promise((resolve, reject) => {
            // Build request parameters based on whether this is initial load or pagination
            let variablesObj;

            if (after) {
                // For pagination requests
                variablesObj = {"data":{"count":12,"include_reel_media_seen_timestamp":true,"include_relationship_info":true,"latest_besties_reel_media":true,"latest_reel_media":true},"username":username,"__relay_internal__pv__PolarisIsLoggedInrelayprovider":true,"__relay_internal__pv__PolarisShareSheetV3relayprovider":false,"first":12,"last":null,"after":after,"before":null};
            } else {
                // For initial request
                variablesObj = {
                    data: {
                        count: 12,
                        include_reel_media_seen_timestamp: true,
                        include_relationship_info: true,
                        latest_besties_reel_media: true,
                        latest_reel_media: true
                    },
                    username: username,
                    __relay_internal__pv__PolarisIsLoggedInrelayprovider: true,
                    __relay_internal__pv__PolarisShareSheetV3relayprovider: false
                };
            }

            // Log the request for debugging
            console.log(`Fetching profile posts for ${username}${after ? ` with cursor: ${after}` : ''}`);
            console.log("Variables:", JSON.stringify(variablesObj));

            // Determine which endpoint to use based on whether we're paginating
            const endpoint = "https://www.instagram.com/graphql/query"
            // Prepare the request
            const requestOptions = {
                method: 'POST',
                headers: {
                    "x-instagram-ajax": "1016349901",
                    "x-asbd-id": "129477",
                    "x-ig-app-id": "936619743392459",
                    "x-requested-with": "XMLHttpRequest",
                    "x-csrftoken": csrfToken,
                    "content-type": "application/x-www-form-urlencoded"
                },
                credentials: 'include'
            };

            if (after) {
                // For pagination, use URL parameters instead of form data
                requestOptions.body = new URLSearchParams({
                    fb_dtsg: tokendsg,
                    variables: JSON.stringify(variablesObj),
                    doc_id: 9750506811647048,
                    fb_api_caller_class: "RelayModern",
                    fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                    server_timestamps: true
                }).toString();

                fetch(endpoint, requestOptions)
                    .then(processResponse)
                    .catch(handleError);
            } else {
                // For initial request, use form data
                requestOptions.body = new URLSearchParams({
                    fb_dtsg: tokendsg,
                    variables: JSON.stringify(variablesObj),
                    doc_id: 9750506811647048,
                    fb_api_caller_class: "RelayModern",
                    fb_api_req_friendly_name: "PolarisProfilePostsQuery",
                    server_timestamps: true
                }).toString();

                fetch(endpoint, requestOptions)
                    .then(processResponse)
                    .catch(handleError);
            }

            function processResponse(response) {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json().then(processData);
            }

            function processData(json) {
                console.log("Response received:", json);

                // Extract posts from the response
                let posts = [];
                let hasNextPage = false;
                let endCursor = null;

                try {
                    // Find the media data in different possible locations
                    let mediaData = null;

                    if (json.data && json.data.user && json.data.user.edge_owner_to_timeline_media) {
                        // GraphQL query hash response format
                        mediaData = json.data.user.edge_owner_to_timeline_media;
                        hasNextPage = mediaData.page_info.has_next_page;
                        endCursor = mediaData.page_info.end_cursor;
                    } else if (json.data && json.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                        // Standard API response format
                        mediaData = json.data.xdt_api__v1__feed__user_timeline_graphql_connection;
                        hasNextPage = mediaData.page_info.has_next_page;
                        endCursor = mediaData.page_info.end_cursor;
                    }

                    if (mediaData && mediaData.edges) {
                        // Process each post
                        mediaData.edges.forEach(edge => {
                            // Handle different node structures
                            const node = edge.node.media || edge.node;

                            // Log the raw node for debugging
                            console.log("Processing post node:", node);

                            // Extract media ID
                            const mediaId = node.pk || node.id;

                            // Try to find display URL in different possible locations
                            let displayUrl = node.display_url;
                            if (!displayUrl && node.thumbnail_src) {
                                displayUrl = node.thumbnail_src;
                            }
                            if (!displayUrl && node.image_versions2 && node.image_versions2.candidates && node.image_versions2.candidates.length > 0) {
                                displayUrl = getBestImageUrl(node.image_versions2.candidates);
                            }

                            // Try to find video URL in different possible locations
                            let videoUrl = node.video_url;
                            if (!videoUrl && node.video_versions && node.video_versions.length > 0) {
                                videoUrl = node.video_versions[0].url;
                            }

                            // Create post object with all available data
                            const post = {
                                id: node.id,
                                shortcode: node.shortcode || node.code,
                                display_url: displayUrl,
                                is_video: node.is_video || !!videoUrl,
                                video_url: videoUrl,
                                media_id: mediaId,
                                is_carousel: false,
                                carousel_items: []
                            };

                            // Handle carousel posts (multi-photo/video posts)
                            if (node.edge_sidecar_to_children && node.edge_sidecar_to_children.edges) {
                                post.is_carousel = true;
                                post.carousel_items = node.edge_sidecar_to_children.edges.map(e => {
                                    const carouselNode = e.node;

                                    // Try to find display URL for carousel item
                                    let itemDisplayUrl = carouselNode.display_url;
                                    if (!itemDisplayUrl && carouselNode.thumbnail_src) {
                                        itemDisplayUrl = carouselNode.thumbnail_src;
                                    }
                                    if (!itemDisplayUrl && carouselNode.image_versions2 &&
                                        carouselNode.image_versions2.candidates &&
                                        carouselNode.image_versions2.candidates.length > 0) {
                                        itemDisplayUrl = getBestImageUrl(carouselNode.image_versions2.candidates);
                                    }

                                    // Try to find video URL for carousel item
                                    let itemVideoUrl = carouselNode.video_url;
                                    if (!itemVideoUrl && carouselNode.video_versions &&
                                        carouselNode.video_versions.length > 0) {
                                        itemVideoUrl = carouselNode.video_versions[0].url;
                                    }

                                    return {
                                        id: carouselNode.id,
                                        display_url: itemDisplayUrl,
                                        is_video: carouselNode.is_video || !!itemVideoUrl,
                                        video_url: itemVideoUrl,
                                        media_id: carouselNode.pk || carouselNode.id
                                    };
                                });
                            } else if (node.carousel_media && node.carousel_media.length > 0) {
                                // Alternative carousel format
                                post.is_carousel = true;
                                post.carousel_items = node.carousel_media.map(item => {
                                    // Try to find display URL for carousel item
                                    let itemDisplayUrl = null;
                                    if (item.image_versions2 && item.image_versions2.candidates &&
                                        item.image_versions2.candidates.length > 0) {
                                        itemDisplayUrl = getBestImageUrl(item.image_versions2.candidates);
                                    }

                                    // Try to find video URL for carousel item
                                    let itemVideoUrl = null;
                                    if (item.video_versions && item.video_versions.length > 0) {
                                        itemVideoUrl = item.video_versions[0].url;
                                    }

                                    return {
                                        id: item.pk || item.id,
                                        display_url: itemDisplayUrl,
                                        is_video: !!item.video_versions || !!itemVideoUrl,
                                        video_url: itemVideoUrl,
                                        media_id: item.pk || item.id
                                    };
                                });
                            }

                            posts.push(post);
                        });
                    }

                    console.log(`Extracted ${posts.length} posts from response`);

                    // Summary of media types for debugging
                    const videoCount = posts.filter(p => p.is_video).length;
                    const carouselCount = posts.filter(p => p.is_carousel).length;
                    console.log(`Media types: ${videoCount} videos, ${carouselCount} carousels, ${posts.length - videoCount - carouselCount} photos`);

                    // Check for posts without display_url
                    const missingDisplayUrl = posts.filter(p => !p.display_url).length;
                    if (missingDisplayUrl > 0) {
                        console.warn(`Warning: ${missingDisplayUrl} posts are missing display_url`);
                    }

                    // Check for video posts without video_url
                    const missingVideoUrl = posts.filter(p => p.is_video && !p.video_url).length;
                    if (missingVideoUrl > 0) {
                        console.warn(`Warning: ${missingVideoUrl} video posts are missing video_url`);
                    }

                    // Combine with previous posts
                    const combinedPosts = [...allPosts, ...posts];

                    // If there are more pages and we haven't hit the limit, fetch the next page
                    if (hasNextPage && endCursor && combinedPosts.length < 1000) {
                        console.log(`Found more posts. Cursor: ${endCursor}. Fetching next page...`);

                        // Wait a bit to avoid rate limiting
                        setTimeout(() => {
                            fetchProfilePosts(userId, username, csrfToken, endCursor, combinedPosts)
                                .then(resolve)
                                .catch(reject);
                        }, 1000);
                    } else {
                        console.log(`Finished fetching posts. Total: ${combinedPosts.length}`);
                        resolve(combinedPosts);
                    }
                } catch (e) {
                    console.error("Error processing profile posts data:", e);
                    reject(e);
                }
            }

            function handleError(error) {
                console.error("Error fetching profile posts:", error);

                // If we already have some posts, return those instead of failing
                if (allPosts.length > 0) {
                    console.log(`Returning ${allPosts.length} posts that were already fetched`);
                    resolve(allPosts);
                } else {
                    reject(error);
                }
            }
        });
    }
var username=getProfileUsername()



function fetchProfilePostsViaAPI() {
    // Get username from URL
    const username = getProfileUsername();
    if (!username) {
        showProfileDownloadError(this, "Couldn't identify username");
        isProcessingProfile = false;
        return Promise.reject("Couldn't identify username");
    }

    // Update button text and show initial progress
    const buttonElement = document.querySelector('.violet_toolkit_profile_download_btn');
    if (buttonElement) {
        showProgressBar(buttonElement, 0, "Preparing download...");
    }

    // Get filters from session storage
    const filtersJson = localStorage.getItem('violet_toolkit_filters') ||
        sessionStorage.getItem('violet_toolkit_filters');
    let filters = {};

    if (filtersJson) {
        try {
            filters = JSON.parse(filtersJson);
            console.log("Applied filters:", filters);
        } catch (e) {
            console.error("Error parsing filters:", e);
        }
    }

    // If no filters set, create default
    if (!filters.postsRange) {
        filters.postsRange = { from: 1, to: 20 };
    }

    // Store the post count we need to fetch
    const postsNeeded = filters.postsRange.to - filters.postsRange.from + 1;
    console.log(`Posts needed: ${postsNeeded}`);

    return new Promise((resolve, reject) => {
        // First get user ID
        getUserId(username)
            .then(userId => {
                if (!userId) throw new Error("Could not get user ID");

                if (buttonElement) {
                    showProgressBar(buttonElement, 10, "Fetching posts...");
                }

                const token = document.documentElement.outerHTML.match(/csrf_token":".*?(?=")/g);
                const csrfToken = token && token[0] ? token[0].split("\"")[2] : "";

                // Fetch posts using GraphQL API with early stopping
                return fetchProfilePostsWithEarlyStopping(userId, username, csrfToken, filters.postsRange.to, buttonElement);
            })
            .then(posts => {
                if (!posts || posts.length === 0) {
                    throw new Error("No posts found");
                }

                console.log(`Successfully fetched ${posts.length} posts via API`);

                if (buttonElement) {
                    showProgressBar(buttonElement, 60, `Processing ${posts.length} posts...`);
                }

                // Process each post to ensure like_count and comment_count are extracted
                const processedPosts = posts.map(post => processPostData(post));

                // Apply filters
                let filteredPosts = processedPosts;

                if (buttonElement) {
                    showProgressBar(buttonElement, 70, "Applying filters...");
                }

                // Apply filters
                if (filters) {
                    filteredPosts = applyFilters(processedPosts, filters);
                    console.log(`After filtering: ${filteredPosts.length} posts selected for download`);
                }

                // Store filtered posts in cache
                profilePostsCache[username] = filteredPosts;

                if (buttonElement) {
                    showProgressBar(buttonElement, 80, "Preparing download...");
                }

                // Process download
                if (buttonElement) {
                    processProfileDownload(buttonElement, username, filteredPosts);
                }

                // Clear the filters from storage
                localStorage.removeItem('violet_toolkit_filters');
                sessionStorage.removeItem('violet_toolkit_filters');

                resolve(filteredPosts);
            })
            .catch(error => {
                console.error("Error in profile download:", error);
                if (buttonElement) {
                    showProfileDownloadError(buttonElement, error.message);
                }
                reject(error);
            });
    });
}


/**
 * Process downloading profile posts
 */
function processProfileDownload(buttonElement, username, posts) {
    if (posts.length === 0) {
        showProfileDownloadError(buttonElement, "No posts found");
        return;
    }

    // Update progress bar for preparing download
    showProgressBar(buttonElement, 85, `Preparing to download ${posts.length} posts...`);

    // Prepare media data for download
    const mediaData = posts.map(post => {
        let mediaUrls = [];

        // Handle carousels
        if (post.is_carousel && post.carousel_items && post.carousel_items.length > 0) {
            post.carousel_items.forEach(item => {
                mediaUrls.push({
                    url: item.is_video && item.video_url ? item.video_url : item.display_url,
                    type: item.is_video ? 'video' : 'photo',
                    id: item.id
                });
            });
        } else if (post.carousel_media && post.carousel_media.length > 0) {
            // Alternative carousel format
            post.carousel_media.forEach(item => {
                let mediaUrl = null;
                let mediaType = 'photo';

                if (item.video_versions && item.video_versions.length > 0) {
                    mediaUrl = item.video_versions[0].url;
                    mediaType = 'video';
                } else if (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates.length > 0) {
                    mediaUrl = getBestImageUrl(item.image_versions2.candidates);
                }

                if (mediaUrl) {
                    mediaUrls.push({
                        url: mediaUrl,
                        type: mediaType,
                        id: item.pk || item.id
                    });
                }
            });
        } else {
            // Handle single posts
            mediaUrls.push({
                url: post.is_video && post.video_url ? post.video_url : post.display_url,
                type: post.is_video ? 'video' : 'photo',
                id: post.id
            });
        }

        return {
            id: post.id,
            shortcode: post.shortcode || post.code,
            media: mediaUrls,
            like_count: post.like_count,
            comment_count: post.comment_count
        };
    });

    // Update progress bar to downloading state
    showProgressBar(buttonElement, 90, `Starting download...`);

    // Send to background script for downloading
    chrome.runtime.sendMessage({
        profileDownload: true,
        username: username,
        posts: mediaData
    }, response => {
        // Update button status based on response
        if (response && response.success) {
            showProgressBar(buttonElement, 100, `Download Complete!`);

            // Reset after 5 seconds
            setTimeout(() => {
                buttonElement.innerHTML = `
                    <span class="violet_toolkit_icon"></span>
                    <span class="violet_toolkit_text">Download All</span>
                `;
                isProcessingProfile = false;
            }, 5000);
        } else {
            showProfileDownloadCaution(buttonElement, "Waiting for background!!");
        }
    });
}

const styleElement = document.createElement('style');
styleElement.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}



.violet_toolkit_overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 9998;
}

.violet_toolkit_popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    color: #262626;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z-index: 9999;
    width: 350px;
    max-width: 90%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Force specific colors for text elements to ensure visibility in any mode */
.violet_toolkit_popup_title,
.violet_toolkit_filter_label,most_likes_checkbox ,most_comments_checkbox,
.violet_toolkit_button {
    color: #262626 !important;
}

.violet_toolkit_popup input,
.violet_toolkit_popup button {
    color: #262626 !important;
    background-color: white !important;
}

.violet_toolkit_popup input::placeholder {
    color: #8e8e8e !important;
}

/* Dark mode compatible buttons */
.violet_toolkit_button_cancel {
    background-color: #efefef !important;
    color: #262626 !important;
    border: none !important;
}

.violet_toolkit_button_apply {
    background-color: #0095f6 !important;
    color: white !important;
    border: none !important;
}

.violet_toolkit_popup_close {
    color: #8e8e8e !important;
    cursor: pointer;
    font-size: 20px;
}

.violet_toolkit_popup input::-webkit-outer-spin-button,
.violet_toolkit_popup input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.violet_toolkit_popup input[type=number] {
    -moz-appearance: textfield;
}

.violet_toolkit_profile_download_btn {
    min-height: 40px;
    position: relative;
    background-color: #0095f6 !important;
    color: white !important;
}

.violet_toolkit_progress_container {
    width: 100%;
    height: 4px;
    background-color: #efefef;
    border-radius: 2px;
    margin-top: 5px;
    overflow: hidden;
}

.violet_toolkit_progress_bar {
    height: 100%;
    background-color: #0095f6;
    transition: width 0.3s ease;
}

.violet_toolkit_status {
    font-size: 14px;
    text-align: center;
    margin-bottom: 5px;
    color: #262626 !important;
}

.violet_toolkit_filter_group {
    margin-bottom: 15px;
    border-radius: 4px;
    padding: 10px;
}

/* Specific background colors for different filter groups */
.violet_toolkit_filter_group.posts-range {
    background-color: #edf9ff !important;
}

.violet_toolkit_filter_group.top-posts {
    background-color: #fff0f5 !important;
}

/* Force standard colors for different sections */
.violet_toolkit_posts_info {
    background-color: #f9f9f9 !important;
    color: #262626 !important;
}
`;

document.head.appendChild(styleElement);
/**
 * Show error message on profile download button
 */
function showProfileDownloadError(buttonElement, message) {
    buttonElement.innerHTML = `
        <span class="violet_toolkit_icon"></span>
        <span class="violet_toolkit_text">Error: ${message}</span>
    `;

    // Reset after 5 seconds
    setTimeout(() => {
        buttonElement.innerHTML = `
            <span class="violet_toolkit_icon"></span>
            <span class="violet_toolkit_text">Download All</span>
        `;
        isProcessingProfile = false;
    }, 5000);
}
function showProfileDownloadCaution(buttonElement, message) {
    buttonElement.innerHTML = `
        <span class="violet_toolkit_icon"></span>
        <span class="violet_toolkit_text">CAUTION: ${message}</span>
    `;

    // Reset after 5 seconds
    setTimeout(() => {
        buttonElement.innerHTML = `
            <span class="violet_toolkit_icon"></span>
            <span class="violet_toolkit_text">Download All</span>
        `;
        isProcessingProfile = false;
    }, 5000);
}
// Initial scan for posts
function addbutton() {
    const mediaSelectors = [
        'article img:not([data-ig_toolkit_marked])',
        'article video:not([data-ig_toolkit_marked])',
        'div[role*="button"] video:not([data-ig_toolkit_marked])',
        'div[role*="button"] img:not([data-ig_toolkit_marked])',
        'img'
    ];

    document.querySelectorAll(mediaSelectors.join(',')).forEach(function(element) {
        callpush(element);
    });
}

// Initialize
addbutton();

// Add profile specific button when on profile pages
setTimeout(checkForProfilePage, 1000);
// Check periodically for profile page changes (Instagram uses client-side routing)
setInterval(checkForProfilePage, 3000);