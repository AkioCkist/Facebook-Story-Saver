if(location.pathname.includes("stories")==true) {
    (() => {
        document.head.setAttribute('SSvideoURL', 'null');
        videos = document.querySelectorAll('video');
        videoUrl = null;
        for (var i = videos.length - 1; i >= 0; i--) {
            if (videos[i].offsetHeight === 0)
                continue;
            var reactKey = '';
            keys = Object.keys(videos[i]);
            for (var j = 0; j < keys.length; j++) {
                if (keys[j].indexOf('__reactFiber') != -1) {
                    reactKey = keys[j].split('__reactFiber')[1];
                    break;
                }
            }
            try {
                videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[0].data.hdSrc;
            } catch (e) {
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.hdSrc;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[0].data.sdSrc;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children[0].props.children.props.implementations[1].data.sdSrc;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.hdSrc;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i].parentElement.parentElement.parentElement.parentElement['__reactProps' + reactKey].children.props.children.props.implementations[1].data.sdSrc;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.hd_src;
                } catch (e) {
                }
            }
            if (videoUrl == null) {
                try {
                    videoUrl = videos[i]['__reactFiber' + reactKey].return.stateNode.props.videoData.$1.sd_src;
                } catch (e) {
                }
            }
            if (videoUrl != null)
                break;
        }
        console.log(videoUrl)
        window.postMessage(videoUrl)
        if(videoUrl==null){

            window.postMessage("nullvideo")
        }
        document.head.setAttribute('SSvideoURL', videoUrl);
    })();
}
