Swal.fire({
    titleText: 'Story saver: Thank you.',
    icon: 'success',
    html: 'I sincerely apologize for the poor user experience caused by my mistake. The issue has now been resolved and everything is working again. I truly appreciate your support and contributions to this extension. <br>I’ve also created a Telegram and Discord channel to receive your valuable feedback and address any further issues that may arise.<br> Join the chanel<br> <a href="https://discord.gg/gk2TMvb6bh" target=”_blank”><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg></a> <a href="https://t.me/+ZWc9aFBR0wA2NDRl" target=”_blank”><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/></svg></a>',
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

    }
});