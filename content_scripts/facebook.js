



var profile_pic = document.querySelector ("a[role=link][tabindex='0'][href*='https://www.facebook']>img");
var story = document.querySelectorAll("img[draggable=false]");

if (profile_pic != null && top.location.toString().indexOf("stories") != -1) {
	let videos = document.querySelectorAll("video");
    let video = null;
    for (let i=0;i<videos.length;i++)  {
        if(videos[i].offsetHeight !== 0)
            video = videos[i];
    }


    let username = profile_pic.alt;
	if (video !== null) {
        window.postMessage("CALLVIDEO", "*");
	} else {
		savePhotoStory ();
	}
} else {
    chrome.runtime.sendMessage (null, { noStories:true });
}
function savePhotoStory (){
    story = story[0];
    story.innerHTML= story.innerHTML+="<h1>download</h1>>"
    let storyUrl = story.src;
    let username = profile_pic.alt;


    chrome.runtime.sendMessage({downloadv1: storyUrl,idx:username,url:location.href}, (response) => {
        console.log('dow:');
    });

}