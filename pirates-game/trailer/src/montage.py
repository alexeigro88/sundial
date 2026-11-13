import sys,os
from PIL import Image,ImageDraw
d,out,cols=sys.argv[1],sys.argv[2],int(sys.argv[3])
fs=sorted(os.listdir(d));tw,th=1920//cols if cols<3 else 640,0
tw=640 if cols>=3 else 960;th=tw*9//16
rows=(len(fs)+cols-1)//cols;im=Image.new('RGB',(cols*tw,rows*th),'#222')
for i,f in enumerate(fs):
    t=Image.open(os.path.join(d,f)).resize((tw,th));ImageDraw.Draw(t).text((8,6),f.split('_')[1].split('.')[0],fill='#f0f')
    im.paste(t,((i%cols)*tw,(i//cols)*th))
im.save(out,quality=85)
