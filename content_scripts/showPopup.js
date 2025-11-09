Swal.fire({
    titleText: 'Thanks a lot.',
    icon: 'success',
    html: `
    Thanks a lot for using <b>Story Saver</b>!<br>
    If you find this extension useful, please rate us — it means a lot ❤️<br>
    If there's any problem, don't hesitate to send feedback to 
    <a href="mailto:admin@zework.com">admin@zework.com</a>.<br>
    <br>
    🙏 We also want to thank our amazing supporters.<br>
    You can see the list of donors here: 
    <a href="/donate.html" target="_blank">Supporters Page</a><br><br>
    Join the community:<br>
    <a href="https://discord.gg/gk2TMvb6bh" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011..."/>
      </svg>
    </a>
    <a href="https://t.me/+ZWc9aFBR0wA2NDRl" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8..."/>
      </svg>
    </a>
  `,
    showConfirmButton: true,
    confirmButtonText: 'Rate it now <3',
    showCancelButton: true,
    cancelButtonText: 'Later :(',
    backdrop: false,
    allowOutsideClick: false,
    confirmButtonColor: '#27ae60',
}).then((result) => {
    if (result.value){
        if  (navigator.userAgent.indexOf("Edg") != -1)
            window.open("https://microsoftedge.microsoft.com/addons/detail/story-saver/jdljfilepfajjkcnomidldigogbobjod", "_blank");
        else
            window.open("https://chrome.google.com/webstore/detail/story-saver/mafcolokinicfdmlidhaebadidhdehpk/reviews", "_blank");
        chrome.runtime.sendMessage (null, { rateClicked:true });
    }
});