function AddDownload(id) {
    var bitrate = document.getElementById('saavn-bitrate');
    var bitrate_i = bitrate.options[bitrate.selectedIndex].value;
    
    // MP3 server API
    var MP3DL = DOWNLOAD_API + "/add?id=" + id + "&bitrate=" + bitrate_i;
    
    // make API call, if 200, add to download list
    fetch(MP3DL)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // add to download list
                var download_list = document.getElementById("download-list");
                var download_item = document.createElement("li");

                download_item.innerHTML = `
                    <div class="col">
                        <img class="track-img" src="${data.image}" width="50px">
                        <div style="display: inline;">
                            <span class="track-name">${data.song}</span> - 
                            <span class="track-album">${data.album}</span>
                            <br>
                            <span class="track-size">Size : ${data.size}</span>
                            <span class="track-status" style="color:green">Downloading...</span>
                        </div>
                    </div>
                    <hr>
                `;

                // set download_item track_tag to song id
                download_item.setAttribute("track_tag", id);

                // set css class no-bullets
                download_item.className = "no-bullets";

                download_list.appendChild(download_item);

                // every 5 seconds, check download status
                var STATUS_URL = DOWNLOAD_API + "/status?id=" + id;

                // get download_status_span by track_tag and class
                var download_status_span = document.querySelector('[track_tag="' + id + '"] .track-status');

                // change download status to "Downloading..."
                download_status_span.textContent = "Downloading...";

                // check status every 5 seconds
                var interval = setInterval(function () {
                    fetch(STATUS_URL)
                        .then(response => response.json())
                        .then(data => {
                            if (data.status) {
                                // update status
                                download_status_span.textContent = data.status;
                                if (data.size) {
                                    download_size.textContent = "Size: " + data.size;
                                }
                                if (data.status === "Done") {
                                    // download complete, add download button
                                    download_status_span.innerHTML = `<a href="${data.url}" target="_blank">Download MP3</a>`;
                                    // clear interval
                                    clearInterval(interval);
                                    return;
                                }
                            }
                        });
                }, 5000); // check status every 5 seconds
            }
        });
}

  