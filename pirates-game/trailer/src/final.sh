set -e
cd "$(dirname "$0")"
until grep -q "^done" r_sub_ru.log && grep -q "^done" r_sub_en.log; do sleep 5; done
for L in ru en; do S=user; [ $L = en ] && S=useren
ffmpeg -y -loglevel error -i sub_$L.mp4 -i audio_$S.wav -i vo_track_$S.wav -filter_complex "[1:a]volume=0.8[m];[2:a]volume=2.1,alimiter=limit=0.9,apad=whole_dur=35[vo];[m][vo]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[au]" -map 0:v -map "[au]" -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart ready_$L.mp4
ffprobe -v error -show_entries format=duration:stream=nb_frames -of csv=p=0 ready_$L.mp4 | tr '\n' ' '; ls -la ready_$L.mp4; done
grep -c ERR r_sub_ru.log r_sub_en.log || true
