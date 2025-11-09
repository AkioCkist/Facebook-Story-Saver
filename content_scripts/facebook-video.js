
chrome.runtime.sendMessage({openfacebook: true}, (response) => {
    console.log('dow:');
});

var urlvideo=[]




// Chạy khi trang web load
var command=false;
window.addEventListener(
    "message",
    (event) => {
        console.log(event)
        var username="";
        if(event.data.includes("https")){

            try{

                var checkarray=true
                var checkdow=false;
                Arrarystory.forEach(item => {
                    const selector = `div[data-id="${item.id}"]`;
                    const el = document.querySelector(selector);

                    if (el) {
                        console.log(`✅ Tìm thấy phần tử với id = ${item.id}:`, el);
                        if(checkarray==true){
                            checkarray=false;
                            checkdow=true;
                            Getvideo(item.VIDEOID,item.id);
                        }


                    } else {
                        console.warn(`❌ Không tìm thấy phần tử với id = ${item.id}`);
                    }

                });
                if(checkdow==false){
                    addnew()
                }
            }catch (ex){
                username="none"

            }

        }


        if(event.data.includes("CALLVIDEO")){
            command=true;
            const viewer = document.getElementById("viewer_dialog");
            if (!viewer) {


                if(location.href.includes("stories")){

                    var url=location.href
                    const match = url.match(/facebook\.com\/stories\/(\d+)/);

                    if (match) {
                        const id = match[1];

                        parserVideoid(id)


                    }

                }

            }else {


                try {

                    var checkarray = true
                    var checkdow = false;
                    Arrarystory.forEach(item => {
                        const selector = `div[data-id="${item.id}"]`;
                        const el = document.querySelector(selector);

                        if (el) {
                            console.log(`✅ Tìm thấy phần tử với id = ${item.id}:`, el);
                            if (checkarray == true) {
                                checkarray = false;
                                checkdow = true;
                                Getvideo(item.VIDEOID, item.id);
                            }


                        } else {
                            console.warn(`❌ Không tìm thấy phần tử với id = ${item.id}`);
                        }

                    });
                    if (checkdow == false) {
                        addnew()
                    }
                } catch (ex) {
                    username = "none"

                }
            }



        }
        // …
    },
    false,
);







var dataelement;



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action=="changeurl") {



    }



    if (request.countdow) {

        if(request.countdow=="ok") {

            try {
                dataelement.getElementsByClassName("violet_toolkit_icon")[0].style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAU1JREFUaEPtmWEKwjAMhbOb6cnUk6knUyMOStasyZKHG6TgH+3a970XasMmOviYDq6fkAAnIroQ0ZOIHr9Pul9IgFejlgHO6eqJYAmw+/cCMESGKqFKwGD+d0oloDhVJVQlZHWgSijoVJ1CVUJVQkEHqoSCBkZOobbjugodlqvE2vNmrAjAWsc1Ahj9DgeQAnjDtm1cE9h7dvPNOJIAt4wsph0zhAagib99FpFlaEohAsAbaBAsSPbE8rtZ4Gbxm2MT1vQgpHucjEyL54TEZwFoSYxKICw+E8ALkSI+G8AKkSYeATCCSBWPAtAg0sUjASQERDwagNefj04+RiEj+kcGEeVZtAA8biHmVgIIVz1rVgIetxBzKwGEq541tQQsTYpnn4y53etID4B7U35BvbfRfdfcA9Aa7z0ALfRqJbS3FNh9LqHFpbBOoX/X1RtDO1oxf0ZfAwAAAABJRU5ErkJggg==')"

            }catch (ex){}

        }



    }

    if(request.clickaction){


        if(location.pathname.includes("stories")==false){

            console.log( elementping.parentElement.parentElement)
            elementping.parentElement.parentElement.getElementsByClassName("violet_toolkit_dl_btn")[0].click()
        }
    }
});

function SoNumIndex() {
    // Find all styled divs
    const divs = Array.from(document.querySelectorAll('div[style]'));

    // Filter divs that have transition-duration and width in their style
    const matchedDivs = divs.filter(div => {
        const style = div.getAttribute('style');
        return style.includes('transition-duration') && style.includes('width');
    });

    // Count divs with width not equal to 0%
    let count = 0;

    matchedDivs.forEach((div) => {
        const style = div.getAttribute('style');

        // Extract width value using regex
        const widthMatch = style.match(/width:\s*([^;]+)/);
        if (widthMatch && widthMatch[1]) {
            const widthValue = widthMatch[1].trim();
            if (widthValue !== '0%') {
                count++;
            }
        }
    });

    return count;
}


/**
 * Trả về tất cả progressive_url của video trong storyId.
 * Ưu tiên HD, fallback sang SD nếu HD không tồn tại.
 *
 * @param {object|string} jsonInput – object JSON hoặc chuỗi JSON
 * @param {string} storyId          – id story cần lấy (ví dụ: "UzpfSVNDOjk4MzM4MTQyMzI3NzE1NQ==")
 * @returns {string[]}              – mảng URL (HD hoặc SD)
 */
function extractVideoUrlsByStoryId(jsonInput, storyId) {
    // Nếu là chuỗi thì parse
    const data = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;

    const urls = [];

    if (!data?.data?.nodes) return urls;

    data.data.nodes.forEach(node => {
        const edges = node.unified_stories?.edges;
        if (!Array.isArray(edges)) return;

        edges.forEach(edge => {
            const storyNode = edge.node;
            if (!storyNode || storyNode.id !== storyId) return; // chỉ lấy story khớp ID

            // ───────────────────────────────── attachments ─────────────────────────────────
            storyNode.attachments?.forEach(att => {
                const media = att.media;
                const videoData =
                    media?.videoDeliveryResponseFragment?.videoDeliveryResponseResult;

                const progressive = videoData?.progressive_urls;
                if (!Array.isArray(progressive)) return;

                // Phân nhóm HD và fallback
                const hd = progressive.filter(p => p.progressive_url && p.metadata?.quality === "HD");
                const fallback = progressive.filter(p => p.progressive_url);

                (hd.length ? hd : fallback).forEach(p => urls.push(p.progressive_url));
            });
        });
    });

    return urls;
}

/* ==== Cách dùng ====
const storyId = "UzpfSVNDOjk4MzM4MTQyMzI3NzE1NQ==";
const hdOrSdUrls = extractVideoUrlsByStoryId(jsonObject, storyId);
console.log(hdOrSdUrls);
*/

function extractHDVideos(jsonString) {
    try {
        // Parse JSON data if provided as string
        const jsonData = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

        // Array to store HD video URLs
        let hdVideoUrls = [];

        // Process the data.nodes structure
        if (jsonData.data && jsonData.data.nodes) {
            jsonData.data.nodes.forEach(node => {
                // Check for unified_stories
                if (node.unified_stories && node.unified_stories.edges) {
                    node.unified_stories.edges.forEach(edge => {
                        // Check for attachments in each story
                        if (edge.node && edge.node.attachments) {
                            edge.node.attachments.forEach(attachment => {
                                // Look for media with videoDeliveryResponseFragment
                                if (attachment.media &&
                                    attachment.media.videoDeliveryResponseFragment &&
                                    attachment.media.videoDeliveryResponseFragment.videoDeliveryResponseResult) {

                                    const videoData = attachment.media.videoDeliveryResponseFragment.videoDeliveryResponseResult;

                                    // Check for progressive_urls
                                    if (videoData.progressive_urls) {
                                        videoData.progressive_urls.forEach(urlObj => {
                                            // Only push URLs where quality is HD
                                            if (urlObj.progressive_url &&
                                                urlObj.metadata &&
                                                urlObj.metadata.quality === "HD") {

                                                hdVideoUrls.push(urlObj.progressive_url);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }

        return hdVideoUrls;
    } catch (error) {
        console.error("Error extracting HD videos:", error);
        return [];
    }
}

function extractProgressiveUrls(jsonData) {
    try {
        let progressiveUrls = [];

        jsonData.data.nodes.forEach(node => {
            if (node.unified_stories && node.unified_stories.edges) {
                node.unified_stories.edges.forEach(edge => {
                    if (edge.node && edge.node.attachments) {
                        edge.node.attachments.forEach(attachment => {
                            const media = attachment.media;
                            const videoData = media?.videoDeliveryResponseFragment?.videoDeliveryResponseResult;
                            const urls = videoData?.progressive_urls;

                            if (Array.isArray(urls)) {
                                const hdUrls = urls.filter(urlObj =>
                                    urlObj.progressive_url && urlObj.metadata?.quality === "HD"
                                );
                                const fallbackUrls = urls.filter(urlObj =>
                                    urlObj.progressive_url
                                );

                                if (hdUrls.length > 0) {
                                    hdUrls.forEach(urlObj => progressiveUrls.push(urlObj.progressive_url));
                                } else {
                                    fallbackUrls.forEach(urlObj => progressiveUrls.push(urlObj.progressive_url));
                                }
                            }
                        });
                    }
                });
            }
        });

        return progressiveUrls;
    } catch (error) {
        console.error("Error extracting progressive URLs:", error);
        return [];
    }
}

/**
 * Trả về mảng <div> bên trong #viewer_dialog có thuộc tính id
 * @returns {HTMLDivElement[]}
 */
function getDivsWithIdInsideViewerDialog() {
    const viewer = document.getElementById("viewer_dialog");
    if (!viewer) return [];
    return Array.from(viewer.querySelectorAll("div[id]"));
}

/**
 * Quan sát #viewer_dialog; mỗi khi xuất hiện <div id="..."> mới
 * (kể cả khi div đã tồn tại rồi mới gắn id) sẽ gọi callback
 *
 * @param {(el: HTMLDivElement) => void} onFound
 * @returns {() => void} – hàm ngắt quan sát
 */
function observeViewerDialog(onFound = console.log) {
    const viewer = document.getElementById("viewer_dialog");
    if (!viewer) {
        console.warn("#viewer_dialog chưa tồn tại.");
        return () => {};
    }

    // 1) Gửi các div có id hiện có
    getDivsWithIdInsideViewerDialog().forEach(onFound);

    // 2) Theo dõi các thay đổi mới
    const obs = new MutationObserver(muts => {
        muts.forEach(m => {
            // Các node mới được thêm
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;                // Không phải Element
                const el = /** @type {HTMLElement} */ (node);

                // a) Chính nó là <div id="...">
                if (el.tagName === "DIV" && el.id) onFound(el);

                // b) Hoặc có con <div id="...">
                el.querySelectorAll?.("div[id]").forEach(div => onFound(div));
            });

            // 3) Nếu thuộc tính id của phần tử hiện hữu vừa được gắn
            if (m.type === "attributes" && m.attributeName === "id") {
                const el = /** @type {HTMLElement} */ (m.target);
                if (el.tagName === "DIV" && el.id) onFound(el);
            }
        });
    });

    // childList: để bắt node mới; subtree: lồng sâu; attributes: theo dõi id gắn thêm
    obs.observe(viewer, { childList: true, subtree: true, attributes: true, attributeFilter: ["id"] });

    // Hàm ngắt
    return () => obs.disconnect();
}

/* ---------- Cách sử dụng ---------- */
var Arrarystory=[]
// Bắt đầu quan sát
var stop = observeViewerDialog(div => {

    const x = Arrarystory
    var fuccheck=true;
    x.forEach(item => {
        if(item.VIDEOID==div.id){
            fuccheck=false
        }
    });
    if(fuccheck==true) {
        parserVideoid(div.id)
    }

});


(function interceptHistory() {
    // Lưu bản gốc
    const _push = history.pushState;
    const _replace = history.replaceState;

    function fire(url) {
        window.dispatchEvent(new CustomEvent("urlchange", { detail: { url } }));
    }

    history.pushState = function (...args) {
        _push.apply(this, args);
        fire(args[2] ?? location.href);
    };

    history.replaceState = function (...args) {
        _replace.apply(this, args);
        fire(args[2] ?? location.href);
    };

    // Khi người dùng back/forward
    window.addEventListener("popstate", () => fire(location.href));
})();

/* --------- Cách sử dụng --------- */
function addnew(){
    Arrarystory=[]
    stop();
    stop = observeViewerDialog(div => {
        parserVideoid(div.id)

    });
}

// Khi không cần nữa:
// stop();

function  parserVideoid(VIDEOID) {


    var uid = "";
    var fbag = ""
    try {
        uid = document.cookie.match(/c_user.*?(?=;)/g)[0].split("=")[1]
        fbag = document.documentElement.innerHTML.match(/"token":".*?(?=")/g)[0].split("\"")[3]
    } catch (ex) {

    }




    fetch("https://www.facebook.com/api/graphql/", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,vi;q=0.8",
            "content-type": "application/x-www-form-urlencoded",
            "priority": "u=1, i",
            "sec-ch-prefers-color-scheme": "dark",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-full-version-list": "\"Not(A:Brand\";v=\"99.0.0.0\", \"Google Chrome\";v=\"133.0.6943.127\", \"Chromium\";v=\"133.0.6943.127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-ch-ua-platform-version": "\"15.3.1\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "359341",
            "x-fb-friendly-name": "useMWEncryptedBackupsFetchBackupIdsV2Query",

        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "av="+uid+"&__aaid=0&__user="+uid+"&__a=1&__req=t&__hs=20150.HYP%3Acomet_pkg.2.1...1&dpr=2&__ccg=EXCELLENT&__rev=1020527715&__s=gbg29a%3Anyn9da%3A1yufv6&__hsi=7477437896286354466&__dyn=7xeXzWK1ixt0mUyEqxemh0noeEb8nwgUao4u5QdwSwAyUco2qwJyE24wJwpUe8hwaG1sw9u0LVEtwMw6ywMwto886C11wBz81s8hwGxu782lwv89kbxS1Fwc61awkovwRwlE-U2exi4UaEW2G1jwUBwJK14xm3y11xfxmu3W3iU8o4Wm7-2K0-obUG2-azqwaW1jg2cwMwhEkxebwHwKG4UrwFg2fwxyo6J0qo4e16wWzUfHDzUiBG2OUqwjVqwLwHwea1ww&__csr=gin4gDbslkJjOgJ4cItf8xApnbiTsAYnknvNfeRtnbR44uRq9b-HayZ8z-g_qbiSpAGQCKBRq9h4m8K--jVmiFYOmbKV5GmjLG9yZGaVaKFUHBFSJkEgRKhG8hEC9zEGaooz8hySiaG4oPBGUO-rwBF1eiAry-7F8GUGczpoOq3h2Elwwxmm6pogyFogCxidwQGqUmzVoHG2Cq5898nx614y9FUjzu2S1bwWDixW5EdpUozUSawvoixHy9Ey3q14K19wAxGhx26Ey6ElyF8vCwUzovwVxDAx-0a8wtofo7O2G0RUjwgU1486q0mu1ECwtF4ZkQbCo33wm9E4hwHw6jw920A86qumayoc8a-2W0X82axfCoOh4Wx6u542C1qxG0I8SRK8x-3S0P828y5Cw4uxa03nS1Tw7qw1T-00D0804ui0Lolw5iy80Wi0pvg3hxu1fg5a5o2yw9h1W2Ceg7S0bqwjo2iw2UA1cwb-0zo0D-O02mU1ZU08o-06RFYw1wo084o0orw1wu09kw1Aq5d03oU0B20uaawvmEiw&__comet_req=15&fb_dtsg="+fbag+"&jazoest=25225&lsd=tgJITN515HhMD_0peTHNxB&__spin_r=1020527715&__spin_b=trunk&__spin_t=1740976678&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=StoriesViewerBucketPrefetcherMultiBucketsQuery&variables=%7B%22bucketIDs%22%3A%5B%22"+VIDEOID+"%22%5D%2C%22scale%22%3A2%2C%22blur%22%3A20%2C%22shouldEnableArmadilloStoryReply%22%3Atrue%2C%22shouldEnableLiveInStories%22%3Atrue%2C%22feedbackSource%22%3A65%2C%22useDefaultActor%22%3Afalse%2C%22feedLocation%22%3A%22COMET_MEDIA_VIEWER%22%2C%22focusCommentID%22%3Anull%2C%22shouldDeferLoad%22%3Afalse%2C%22isStoriesArchive%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=9340191609394579",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.text())
        .then(json => {
            var jsonx=json.split("\n")[0];
            console.log(jsonx)

            var jsonparser=(JSON.parse(jsonx));


            const edges = jsonparser.data.nodes[0].unified_stories.edges;

            edges.forEach((edge, index) => {
                if (edge?.node?.id) {
                    var  id= edge.node.id;
                    Arrarystory.push({VIDEOID, id});
                    console.log(`Edge ${index}: ID =`, edge.node.id);
                }
            });



            console.log(Arrarystory)
            var x=Arrarystory
            const seen = new Set();
            const filtered = x.filter(item => {
                const key = `${item.VIDEOID}__${item.id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            Arrarystory=filtered


            if(command==true){
                command=false
                try {

                    var checkarray = true
                    var checkdow = false;
                    Arrarystory.forEach(item => {
                        const selector = `div[data-id="${item.id}"]`;
                        const el = document.querySelector(selector);

                        if (el) {
                            console.log(`✅ Tìm thấy phần tử với id = ${item.id}:`, el);
                            if (checkarray == true) {
                                checkarray = false;
                                checkdow = true;
                                Getvideo(item.VIDEOID, item.id);
                            }


                        } else {
                            console.warn(`❌ Không tìm thấy phần tử với id = ${item.id}`);
                        }

                    });
                    if (checkdow == false) {
                        addnew()
                    }
                } catch (ex) {
                    username = "none"

                }

            }
        })
        .catch(err => console.error(err));







}


/**
 * Đi sâu vào mọi nút (node) của GraphQL response,
 * tìm attachments → media là Video, sau đó lấy progressive_urls
 * có metadata.quality === "HD".
 * @param {object} root – object đã parse từ tsconfig.json
 * @returns {string[]} – mảng các URL video HD
 */
function getHdVideoUrls(root, nodeid = "") {
    const results = [];

    /** Duyệt sâu không giới hạn */
    function walk(node) {
        if (!node || typeof node !== 'object') return;
        if (nodeid !== "" && node.id !== nodeid) return;

        if (node.attachments) {
            node.attachments.forEach(att => {
                const media = att.media;

                const isVideo =
                    media?.__isMedia === 'Video' ||
                    media?.__typename === 'Video';

                if (!isVideo) return;

                const progressive =
                    media.progressive_urls ||
                    media.videoDeliveryResponseFragment?.videoDeliveryResponseResult?.progressive_urls;

                if (!Array.isArray(progressive)) return;

                // Tách HD và non-HD
                const hdUrls = progressive.filter(p => p?.metadata?.quality === "HD" && p.progressive_url);
                const fallbackUrls = progressive.filter(p => p?.progressive_url); // lấy tất cả

                if (hdUrls.length > 0) {
                    hdUrls.forEach(p => results.push(p.progressive_url));
                } else {
                    fallbackUrls.forEach(p => results.push(p.progressive_url));
                }
            });
        }

        Object.values(node).forEach(walk);
    }

    walk(root);
    return results;
}

/* ✨ Ví dụ dùng:
   const json = JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
   const hdUrls = getHdVideoUrls(json);
   console.log(hdUrls.join('\n'));
*/
//Getvideo(706365595295960)
parserVideoid(100863979616707)
function  Getvideo(VIDEOID,storyid="") {


    var uid = "";
    var fbag = ""
    try {
        uid = document.cookie.match(/c_user.*?(?=;)/g)[0].split("=")[1]
        fbag = document.documentElement.innerHTML.match(/"token":".*?(?=")/g)[0].split("\"")[3]
    } catch (ex) {

    }




    fetch("https://www.facebook.com/api/graphql/", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,vi;q=0.8",
            "content-type": "application/x-www-form-urlencoded",
            "priority": "u=1, i",
            "sec-ch-prefers-color-scheme": "dark",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-full-version-list": "\"Not(A:Brand\";v=\"99.0.0.0\", \"Google Chrome\";v=\"133.0.6943.127\", \"Chromium\";v=\"133.0.6943.127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-ch-ua-platform-version": "\"15.3.1\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "359341",
            "x-fb-friendly-name": "useMWEncryptedBackupsFetchBackupIdsV2Query",

        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "av="+uid+"&__aaid=0&__user="+uid+"&__a=1&__req=t&__hs=20150.HYP%3Acomet_pkg.2.1...1&dpr=2&__ccg=EXCELLENT&__rev=1020527715&__s=gbg29a%3Anyn9da%3A1yufv6&__hsi=7477437896286354466&__dyn=7xeXzWK1ixt0mUyEqxemh0noeEb8nwgUao4u5QdwSwAyUco2qwJyE24wJwpUe8hwaG1sw9u0LVEtwMw6ywMwto886C11wBz81s8hwGxu782lwv89kbxS1Fwc61awkovwRwlE-U2exi4UaEW2G1jwUBwJK14xm3y11xfxmu3W3iU8o4Wm7-2K0-obUG2-azqwaW1jg2cwMwhEkxebwHwKG4UrwFg2fwxyo6J0qo4e16wWzUfHDzUiBG2OUqwjVqwLwHwea1ww&__csr=gin4gDbslkJjOgJ4cItf8xApnbiTsAYnknvNfeRtnbR44uRq9b-HayZ8z-g_qbiSpAGQCKBRq9h4m8K--jVmiFYOmbKV5GmjLG9yZGaVaKFUHBFSJkEgRKhG8hEC9zEGaooz8hySiaG4oPBGUO-rwBF1eiAry-7F8GUGczpoOq3h2Elwwxmm6pogyFogCxidwQGqUmzVoHG2Cq5898nx614y9FUjzu2S1bwWDixW5EdpUozUSawvoixHy9Ey3q14K19wAxGhx26Ey6ElyF8vCwUzovwVxDAx-0a8wtofo7O2G0RUjwgU1486q0mu1ECwtF4ZkQbCo33wm9E4hwHw6jw920A86qumayoc8a-2W0X82axfCoOh4Wx6u542C1qxG0I8SRK8x-3S0P828y5Cw4uxa03nS1Tw7qw1T-00D0804ui0Lolw5iy80Wi0pvg3hxu1fg5a5o2yw9h1W2Ceg7S0bqwjo2iw2UA1cwb-0zo0D-O02mU1ZU08o-06RFYw1wo084o0orw1wu09kw1Aq5d03oU0B20uaawvmEiw&__comet_req=15&fb_dtsg="+fbag+"&jazoest=25225&lsd=tgJITN515HhMD_0peTHNxB&__spin_r=1020527715&__spin_b=trunk&__spin_t=1740976678&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=StoriesViewerBucketPrefetcherMultiBucketsQuery&variables=%7B%22bucketIDs%22%3A%5B%22"+VIDEOID+"%22%5D%2C%22scale%22%3A2%2C%22blur%22%3A20%2C%22shouldEnableArmadilloStoryReply%22%3Atrue%2C%22shouldEnableLiveInStories%22%3Atrue%2C%22feedbackSource%22%3A65%2C%22useDefaultActor%22%3Afalse%2C%22feedLocation%22%3A%22COMET_MEDIA_VIEWER%22%2C%22focusCommentID%22%3Anull%2C%22shouldDeferLoad%22%3Afalse%2C%22isStoriesArchive%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=9340191609394579",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.text())
        .then(json => {
            var jsonx=json.split("\n")[0];
            console.log(jsonx)
            var jsonparser=(JSON.parse(jsonx));
            var DATa=   extractVideoUrlsByStoryId(jsonparser,storyid)
            console.log(DATa)

            var ex=extractHDVideos(jsonparser)
            if(DATa.length!=0){
                ex=DATa
            }
            if(ex.length==0){

                ex=extractVideoUrlsByStoryId(jsonparser,storyid)
            }

            var soluongindex=          SoNumIndex()
            var indexnew=(ex[0])
            var videox=(extractProgressiveUrls(jsonparser)[0]);


            chrome.runtime.sendMessage({downloadv1: indexnew, idx: VIDEOID, url: location.href}, (response) => {
                console.log('dow:');
            });

        })
        .catch(err => console.error(err));







}



//Getvideo("123992256015312")



document.addEventListener("copy", function (event) {
    let copiedText = document.getSelection().toString();
    var id= extractFacebookStoryId(copiedText)
    Getvideo(id)
    // Hiển thị stack trace để xem sự kiện bắt nguồn từ đâu


    // (Tùy chọn) Chặn sự kiện để kiểm tra nếu cần
    // event.preventDefault();
});


function extractFacebookStoryId(url) {
    const match = url.match(/facebook\.com\/stories\/(\d+)\//);
    return match ? match[1] : null;
}


function  clickbtn(){

    dataelement=this
    var uid="";
    var fbag=""
    try{
        uid=   document.cookie.match(/c_user.*?(?=;)/g)[0].split("=")[1]
        fbag= document.documentElement.innerHTML.match(/"async_get_token":".*?(?=")/g)[0].split("\"")[3]
    }catch (ex){

    }


    if(uid!="") {

        setTimeout(() => {
            dataelement.getElementsByClassName("violet_toolkit_icon")[0].style.backgroundImage = "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyBhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiIHdpZHRoPSI2MHB4IiBoZWlnaHQ9IjYwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+CjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgwLDUwKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxnIHRyYW5zZm9ybT0icm90YXRlKDApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjg3NXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC44NzVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4yMTMyMDM0MzU1OTY0Myw3MS4yMTMyMDM0MzU1OTY0MykiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iNSIgZmlsbD0iIzc5MzJiZiIgZmlsbC1vcGFjaXR5PSIwLjg3NSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjc1cyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49Ii0wLjc1cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAsODApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoOTApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC43NSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjYyNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC42MjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOC43ODY3OTY1NjQ0MDM1NzcsNzEuMjEzMjAzNDM1NTk2NDMpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuNjI1IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iLTAuNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC41cyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlPgo8L2NpcmNsZT4KPC9nPgo8L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAsNTAuMDAwMDAwMDAwMDAwMDEpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMTgwKSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuNSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjM3NXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4zNzVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOC43ODY3OTY1NjQ0MDM1NywyOC43ODY3OTY1NjQ0MDM1NzcpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGcgdHJhbnNmb3JtPSJyb3RhdGUoMjI1KSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI1IiBmaWxsPSIjNzkzMmJmIiBmaWxsLW9wYWNpdHk9IjAuMzc1IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBiZWdpbj0iLTAuMjVzIiB2YWx1ZXM9IjEuNSAxLjU7MSAxIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHZhbHVlcz0iMTswIiBiZWdpbj0iLTAuMjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OS45OTk5OTk5OTk5OTk5OSwyMCkiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgyNzApIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC4yNSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgYmVnaW49Ii0wLjEyNXMiIHZhbHVlcz0iMS41IDEuNTsxIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdmFsdWVzPSIxOzAiIGJlZ2luPSItMC4xMjVzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4yMTMyMDM0MzU1OTY0MywyOC43ODY3OTY1NjQ0MDM1NykiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgo8ZyB0cmFuc2Zvcm09InJvdGF0ZSgzMTUpIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjUiIGZpbGw9IiM3OTMyYmYiIGZpbGwtb3BhY2l0eT0iMC4xMjUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPgogIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGJlZ2luPSIwcyIgdmFsdWVzPSIxLjUgMS41OzEgMSIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHN0eWxlPSJhbmltYXRpb24tcGxheS1zdGF0ZTogcnVubmluZzsgYW5pbWF0aW9uLWRlbGF5OiAwczsiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGtleVRpbWVzPSIwOzEiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE7MCIgYmVnaW49IjBzIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGU+CjwvY2lyY2xlPgo8L2c+CjwvZz4KPCEtLSBbbGRpb10gZ2VuZXJhdGVkIGJ5IGh0dHBzOi8vbG9hZGluZy5pby8gLS0+PC9zdmc+')"
        }, 1);

        var idpost = this.id;

        if(location.href.includes("watch/?v=")||location.href.includes("watch?v=")){
            try {
                idpost = location.href.split("=")[1]
            }catch (ex){

            }
        }
        fetch("https://www.facebook.com/video/video_data_async/?video_id=" + idpost + "&fb_dtsg_ag="+fbag+"&__user="+uid+"&__a=1", {
            "headers": {
                "accept": "*/*",
                "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                "priority": "u=1, i",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "none"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.text())
            .then(json => {
                const results = [];  // Mảng để chứa kết quả


                var json = (json.replace("for (;;);", ""));
                var urlvideo = (JSON.parse(json).payload.hd_src)

                if (urlvideo == null) {

                    urlvideo = (JSON.parse(json).payload.sd_src)

                }
                chrome.runtime.sendMessage({downloadv1: urlvideo, idx: idpost, url: location.href}, (response) => {
                    console.log('dow:');
                });


            })
            .catch(err => console.error(err));
    }

}

function isNumericString(str) {
    const regex = /^[0-9]+$/;
    return regex.test(str);
}
function addbtn() {
    var maxadd=0;
    var max1 = handlerpax = document.querySelectorAll('div[data-instancekey^="id-vpuid"]');

    for (var i in max1) {
        var panent = true;
        var max = max1[i];
        var dataele = max1[i];
        if( ! dataele.getAttribute("toolin")){

            console.log(max)
            var idpost = ""
            var reelpost = location.pathname.includes("/reel/");
            var videourl = location.pathname.includes("/videos/");
            if (!reelpost && !videourl) {
                while (panent) {
                    maxadd += 1
                    max = max.parentElement;

                    var query = max.querySelectorAll('a[href^="/reel/"], a[href^="/watch/?v="], a[href*="/videos/"]');
                    if (query.length != 0) {
                        if (query[0].href.includes("/reel/")) {

                            idpost = query[0].href.split("/")[4]

                        }
                        if (query[0].href.includes("pagechienca/")) {

                            idpost = query[0].href.split("/")[5]

                        } else {

                            idpost = query[0].href.split("=")[1].split("&")[0]
                            if(isNumericString(idpost)==false){

                                idpost = query[0].href.split("/")[5]
                                if(isNumericString(idpost)==false){

                                    idpost = query[0].href.split("/")[6].split("?")[0]

                                }

                            }
                        }
                        break
                    }
                    if (maxadd > 100) {
                        break;
                    }


                }
            } else if (reelpost) {
                idpost = location.href.split("/")[4]


            } else if (videourl) {
                idpost = location.href.split("/")[5]


            }
            if (idpost != "" && idpost!="ifu") {
                if (reelpost) {
                    if (!dataele.getAttribute("toolin")) {

                        var obj = document.createElement('div');
                        obj.id = idpost;
                        obj.onclick = clickbtn;
                        obj.className = "violet_toolkit_dl_btn"
                        obj.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span>    <span class="violet_toolkit_icon"></span>    '
                        max.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(obj);
                        dataele.setAttribute("toolin", "1")
                    }


                } else {
                    if (!dataele.getAttribute("toolin")) {
                        var obj = document.createElement('div');
                        obj.id = idpost;
                        obj.onclick = clickbtn;
                        obj.className = "violet_toolkit_dl_btn"
                        obj.innerHTML = '<span class="violet_toolkit_dl_pregress_loader"></span>    <span class="violet_toolkit_icon"></span>    '
                        max.parentElement.appendChild(obj);
                        dataele.setAttribute("toolin", "1")
                    }
                }
            }
        }
    }

}

function addbuttontostory(){



    try{

        console.log("online")

        if (location.href.toString().indexOf("stories") != -1) {


            let videos = document.querySelectorAll("video");
            let video = null;
            for (let i=0;i<videos.length;i++)  {
                if(videos[i].offsetHeight !== 0)
                    video = videos[i];
            }



            if (video !== null) {




                if (!video.parentElement.querySelector(".download-btn")) {

                    // Tạo nút
                    let btn = document.createElement("button");
                    btn.innerText = "⬇download";
                    btn.classList.add("download-btn");

                    // Xử lý sự kiện khi bấm nút
                    btn.addEventListener("click", () => {
                        var username;
                        try{

                            var checkarray=true
                            var checkdow=false;
                            Arrarystory.forEach(item => {
                                const selector = `div[data-id="${item.id}"]`;
                                const el = document.querySelector(selector);

                                if (el) {
                                    console.log(`✅ Tìm thấy phần tử với id = ${item.id}:`, el);
                                    if(checkarray==true){
                                        checkarray=false;
                                        checkdow=true;
                                        Getvideo(item.VIDEOID,item.id);
                                    }


                                } else {
                                    console.warn(`❌ Không tìm thấy phần tử với id = ${item.id}`);
                                }

                            });
                            if(checkdow==false){
                                command = true;
                                addnew()
                            }
                        }catch (ex){
                            username="none"

                        }

                        try {

                            const viewer = document.getElementById("viewer_dialog");
                            if (!viewer) {

                                command = true;
                                if (location.href.includes("stories")) {

                                    var url = location.href
                                    const match = url.match(/facebook\.com\/stories\/(\d+)/);

                                    if (match) {
                                        const id = match[1];

                                        parserVideoid(id)


                                    }

                                }

                            }
                        }catch (ex){

                        }
                    });

                    // Định dạng CSS cho nút
                    btn.style.position = "absolute";
                    btn.style.bottom = "10px"; // Góc dưới
                    btn.style.left = "10px";   // Góc trái
                    btn.style.background = "#fff";  // Màu trắng
                    btn.style.color = "#000";  // Chữ đen
                    btn.style.border = "none";
                    btn.style.padding = "8px 12px";
                    btn.style.borderRadius = "5px";
                    btn.style.cursor = "pointer";
                    btn.style.fontSize = "14px";
                    btn.style.fontWeight = "bold";
                    btn.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
                    btn.style.zIndex = "1000";

                    // Đảm bảo video và thẻ chứa nó có vị trí relative để căn chỉnh chính xác
                    video.style.position = "relative";
                    video.parentElement.style.position = "relative";

                    // Gắn nút vào video
                    video.parentElement.appendChild(btn);


                }

            } else {

            }
        } else {
            chrome.runtime.sendMessage (null, { noStories:true });
        }


    }catch (ex){
        console.log(ex)
    }
}
addbuttontostory()

const targetNode = document.getElementsByTagName("body")[0]


// Options for the observer (which mutations to observe)
const config = { attributes: true,subtree: true};

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        //  console.log(mutation.target.tagName)
        if (mutation.type === 'attributes') {


            if(mutation.target.tagName=="VIDEO"){


                addbuttontostory()

                try {





                    addbtn();

                }catch (ex){

                }



            }



            // console.log(mutation.target.parentElement);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
try {
    addbtn();

}catch (ex){}
