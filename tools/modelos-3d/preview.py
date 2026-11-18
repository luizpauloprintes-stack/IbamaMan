import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':1400,'height':760}); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
        await pg.goto('http://127.0.0.1:8765/studio.html'); await pg.wait_for_function('window.studioReady===true',timeout=20000)
        await pg.evaluate("""()=>{
          const S=window.STUDIO,list=[];
          [0,1,2,3].forEach(d=>list.push([S.fiscal(d,0),64,20,24]));
          [1,2,3,4].forEach(f=>list.push([S.fiscal(2,f),64,20,24]));
          list.push([S.garimpeiro(0),64,20,24],[S.garimpeiro(1),64,20,24]);
          list.push([S.balsa(),64,10,38],[S.escavadeira(0),80,16,36],[S.escavadeira(2),80,16,36],[S.dragagem(0),80,12,38]);
          list.push([S.boss(false,false),112,34,22],[S.boss(false,true),112,34,22],[S.boss(true,false),112,34,22],[S.boss(true,true),112,34,22]);
          list.push([S.crate(),64,14,40],[S.logs(),64,14,40],[S.papers(),64,14,40],[S.desk(),64,14,40],[S.bomb(false),48,12,35],[S.bomb(true),48,12,35],[S.helicopter(),112,24,35],[S.drone(),64,10,40]);
          const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-wrap:wrap;gap:6px;padding:6px;align-items:flex-end';
          for(const [o,s,gy,el] of list){const c=S.render(o,s,gy,el,2);c.style.cssText='background:#5e6b40;width:'+c.width+'px';wrap.appendChild(c)}
          document.body.appendChild(wrap);
        }""")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path='./preview.png',full_page=True)
        print(errs[:5]); await b.close()
asyncio.run(main())
