set -e
cd "$(dirname "$0")"
L=$1; S=""; [ "$L" = "en" ] && S="_en"
V=video_$L.mp4
ffmpeg -y -loglevel error -i $V -i audio$S.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -movflags +faststart -shortest out_${L}_no_voice.mp4
ffmpeg -y -loglevel error -i out_${L}_no_voice.mp4 -i audio$S.wav -i vo_scratch$S.wav -filter_complex "[1:a]volume=0.8[m];[2:a]volume=1.5[v];[m][v]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart out_${L}_scratch_voice.mp4
ffmpeg -y -loglevel error -i audio$S.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 out_${L}_music_sfx.wav
ls -la out_${L}_*
