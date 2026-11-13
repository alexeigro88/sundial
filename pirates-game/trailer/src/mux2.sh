set -e
cd "$(dirname "$0")"
# $1 = base video (0..779), $2 = re-timed ending (780..944), $3 = music mix, $4 = placed voice track, $5 = output
ffmpeg -y -loglevel error -i $1 -i $2 -i $3 -i $4 -filter_complex "[0:v]trim=end_frame=780,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v];[2:a]volume=0.8[m];[3:a]volume=2.1,alimiter=limit=0.9[vo];[m][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[au]" -map "[v]" -map "[au]" -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart $5
ffprobe -v error -show_entries format=duration:stream=nb_frames -of csv=p=0 $5 | tr '\n' ' '; ls -la $5
