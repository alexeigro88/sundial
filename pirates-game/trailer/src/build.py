import io
s=io.open('../pirates.html',encoding='utf8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep("const ren=new T.WebGLRenderer({canvas:cv,antialias:true});","const ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});")
rep("function floatTxt(x,y,z,txt,cls){","function floatTxt(x,y,z,txt,cls){(window.__floats=window.__floats||[]).push({x,y,z,txt,cls,t:tNow});return;")
rep("hero.visible=P.inv>0?Math.floor(tNow*14)%2===0:true;","hero.visible=true;")
rep("function frame(now){requestAnimationFrame(frame);","function frame(now){if(window.__manual)return;requestAnimationFrame(frame);")
rep("function hurtHero(m){if(P.inv>0||P.giant>0)return;","function hurtHero(m){if(window.__noHurt||P.inv>0||P.giant>0)return;")
rep("  ren.render(scene,cam);","  if(window.__camFn)window.__camFn(cam);if(!window.__skipGL)ren.render(scene,cam);")
rep("window.__game={ISL,","window.__game={update,render,keys,joy,attack,jump,dash,usePow,hud,cam,scene,hero,hBody,ren,T,fx,cd,sfx,FR,FBY,BOSS,drawFruit,drawPoster,drawMonster2,drawHero2,scribble,R,pl,poly,path,chests,DEC,xMark,parrot,placeAt,syncMons,syncShips,CAVE,shadow,islandAt,inside,add,flat,mat,money,amb,sun,get tNow(){return tNow;},setStarted(v){started=v;},ISL,")
s=s.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','../node_modules/three/build/three.min.js')
head='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[hidden]{display:none!important}</style><script>window.__manual=true;</script></head><body>'
tail='<style>.hud,#shopWrap,.mid,.pad,.ov,#joy,.float{display:none!important}html,body{background:#fbfaf4}</style><script src="dir_core.js"></script><script src="dir_map.js"></script><script src="dir_shots.js"></script><script>window.__ready=true;</script></body></html>'
io.open('trailer.html','w',encoding='utf8').write(head+s+tail)
print('ok',len(s))
