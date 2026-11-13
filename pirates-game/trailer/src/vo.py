# Scratch voice-over: synthesised guide track, to be replaced by a real recording.
import subprocess,json,os,sys
EN=len(sys.argv)>1 and sys.argv[1]=='en'
LINES_EN=[(0.45,'A dad and his son drew a game.'),(4.05,'And it came alive!'),(5.25,'This is you.'),(6.55,'Jump!'),(8.30,'Slash!'),(10.05,'Eat magic fruits!'),(12.15,'Sail!'),(14.65,'Fire!'),
 (17.55,'Explore dark caves.'),(20.10,'Four pirates. Wanted.'),(23.05,'Caught!'),(24.08,'Islands!'),(24.58,'Monsters!'),(25.08,'Fruits!'),(25.58,'And a parrot.'),(27.25,'Pirates of the Pencil Sea.'),(28.75,'Draw, animate, play!')]
LINES=[(0.45,'Однажды папа и сын нарисовали игру.'),(4.05,'И она ожила!'),(5.25,'Это — ты.'),(6.55,'Прыгай!'),(8.30,'Руби!'),(10.05,'Ешь волшебные фрукты!'),(12.15,'Плыви!'),(14.65,'Стреляй!'),
 (17.55,'Исследуй тёмные пещеры.'),(20.10,'Четыре пирата. В розыске.'),(23.05,'Пойман!'),(24.08,'Острова!'),(24.58,'Монстры!'),(25.08,'Фрукты!'),(25.58,'И попугай.'),(27.25,'Пираты Карандашного моря.'),(28.75,'Нарисуй, оживи, играй!')]
SFX='_en' if EN else ''
if EN:LINES=LINES_EN
os.makedirs('vo'+SFX,exist_ok=True);meta=[];ins=[];filt=[]
for i,(t,txt) in enumerate(LINES):
    raw=f'vo{SFX}/r{i}.wav';out=f'vo{SFX}/l{i}.wav'
    subprocess.run(['espeak-ng','-v','en-us' if EN else 'ru','-s','168' if EN else '138','-p','28','-a','190','-w',raw,txt],check=True)
    # deeper, fuller, a touch of room: trailer-narrator treatment
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',raw,'-af','aresample=44100,asetrate=44100*0.88,aresample=44100,atempo=1.10,highpass=f=70,bass=g=7:f=140,treble=g=-2:f=5000,acompressor=threshold=-20dB:ratio=4:attack=5:release=80:makeup=6,aecho=0.8:0.5:70|130:0.22|0.12,silenceremove=start_periods=1:start_threshold=-45dB',out],check=True)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',out]).decode())
    meta.append([t,round(d,2),txt]);ins+=['-i',out];filt.append(f'[{i}:a]adelay={int(t*1000)}|{int(t*1000)}[a{i}]')
n=len(LINES)
fc=';'.join(filt)+';'+''.join(f'[a{i}]' for i in range(n))+f'amix=inputs={n}:normalize=0,apad=whole_dur=31,atrim=0:31,pan=stereo|c0=c0|c1=c0[o]'
subprocess.run(['ffmpeg','-y','-loglevel','error']+ins+['-filter_complex',fc,'-map','[o]','vo_scratch'+SFX+'.wav'],check=True)
json.dump(meta,open('vo'+SFX+'.json','w'),ensure_ascii=False,indent=1)
with open('vo_script'+SFX+'.txt','w',encoding='utf8') as f:
    f.write('PIRATES OF THE PENCIL SEA — voice-over script\nTimecode (s) | scratch duration | line\n\n' if EN else 'ПИРАТЫ КАРАНДАШНОГО МОРЯ — текст диктора\nТаймкод (сек) | длительность черновика | фраза\n\n')
    for t,d,txt in meta:f.write(f'{t:5.2f}  | {d:4.2f} | {txt}\n')
print(open('vo_script'+SFX+'.txt',encoding='utf8').read())
