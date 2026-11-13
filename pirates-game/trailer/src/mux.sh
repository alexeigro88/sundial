set -e
cd "$(dirname "$0")"
V=video_raw2.mp4
# music + effects, no voice (for re-voicing)
ffmpeg -y -loglevel error -i $V -i audio.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -movflags +faststart -shortest pirates_trailer_no_voice.mp4
# with the scratch voice-over on top
ffmpeg -y -loglevel error -i pirates_trailer_no_voice.mp4 -i audio.wav -i vo_scratch.wav -filter_complex "[1:a]volume=0.8[m];[2:a]volume=1.5[v];[m][v]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart pirates_trailer_scratch_voice.mp4
ffmpeg -y -loglevel error -i audio.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 pirates_trailer_music_sfx.wav
ls -la pirates_trailer_*.mp4 pirates_trailer_music_sfx.wav
