document.addEventListener('DOMContentLoaded', function () {
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    const playlistURL = 'https://github.com/Alpha5472/Web-IPTV2/blob/main/Sample.m3u?raw=true';
    const proxyPlaylistURL = proxyURL + encodeURIComponent(playlistURL);

    fetch(proxyPlaylistURL)
        .then(response => response.text())
        .then(data => {
            const playlist = document.getElementById('playlist');
            const lines = data.split('\n');
            let firstStreamUrl = null;

            lines.forEach((line, index) => {
                if (line.startsWith('#EXTINF')) {
                    const title = line.split(',')[1];
                    const url = lines[index + 1].trim();
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `<a href="#" data-url="${url}">${title}</a>`;
                    playlist.appendChild(listItem);

                    if (firstStreamUrl === null) {
                        firstStreamUrl = url;
                    }
                }
            });

            if (firstStreamUrl !== null) {
                playStream(firstStreamUrl);
            }

            playlist.addEventListener('click', function (event) {
                event.preventDefault();
                if (event.target && event.target.nodeName === 'A') {
                    const streamUrl = event.target.getAttribute('data-url');
                    playStream(streamUrl);
                }
            });

            setTimeout(function () {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            }, 1800);
        })
        .catch(error => console.error('Error fetching the playlist:', error));

    const playerElement = document.getElementById('player');
    const player = new Clappr.Player({
        parentId: "#player",
        width: '100%',
        height: '100%',
        autoPlay: true,
        mediacontrol: {seekbar: "#bb86fc", buttons: "#e0e0e0"},
        mute: false,
        playback: {
            hlsjsConfig: {
                // Custom HLS.js config
            }
        }
    });

    function playStream(url) {
        console.log('Playing stream:', url);
        player.load(url);
        player.play();
    }
});
