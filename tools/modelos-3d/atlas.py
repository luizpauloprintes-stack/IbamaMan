import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':900,'height':600}); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://127.0.0.1:8765/studio.html'); await pg.wait_for_function('window.studioReady===true',timeout=20000)
        atlas=await pg.evaluate("""()=>{
          const S=window.STUDIO,A={},add=(name,obj,size,gy,el,scale=2,thick=1.1)=>{A[name]={size,src:S.render(obj,size,gy,el,scale,true,thick).toDataURL('image/webp',.92)}};
          for(let c=0;c<4;c++){for(let d=0;d<4;d++)for(let f=0;f<5;f++)add(`f${c}_${d}_${f}`,S.fiscalToon(d,f,c),64,20,18,2,1.5);for(const ps of ['thumbs','cheer','hurt'])add(`f${c}_p_${ps}`,S.fiscalToon(2,0,c,ps),64,20,18,2,1.5)}
          for(let f=0;f<4;f++){add(`garimpeiro_${f}`,S.bandido('run',f),64,20,24);add(`garimpeiro_dig_${f}`,S.bandido('dig',f),64,20,24)}
          add('balsa',S.balsa(),64,10,38);
          for(let f=0;f<4;f++)add(`escavadeira_${f}`,S.escavadeira(f),80,16,36);
          for(let f=0;f<4;f++)add(`dragagem_${f}`,S.dragagem(f),80,12,38);
          for(const [k,e,w] of [['n',false,false],['nw',false,true],['e',true,false],['ew',true,true]])add('boss_'+k,S.boss(e,w),112,34,22);
          add('crate',S.crateGarimpo(),64,14,36);add('logs',S.rocks(),64,14,40);add('papers',S.papers(),64,14,40);add('desk',S.desk(),64,14,40);
          add('bomb',S.bomb(false),48,12,35);add('bomb_red',S.bomb(true),48,12,35);
          add('heli',S.helicopter(),112,24,35);add('drone',S.drone(),64,10,40);
          // versoes grandes para a capa
          add('f0_2_0_hd',S.fiscalToon(2,0,0),64,20,18,7,1.5);add('fiscal_hero_hd',S.fiscal(2,0,true),64,20,18,8);add('hero_tatico_hd',S.heroTatico(),80,26,14,7);add('onca_hd',S.onca(),64,16,20,4);add('arara_hd',S.arara(),64,20,16,4);add('garimpeiro_0_hd',S.bandido('run',0),64,20,24,6);
          add('balsa_hd',S.balsa(),64,10,38,5);add('escavadeira_0_hd',S.escavadeira(0),80,16,36,5);
          add('dragagem_0_hd',S.dragagem(0),80,12,38,4);add('bomb_hd',S.bomb(false),48,12,35,5);
          return A;}""")
        json.dump(atlas,open('/home/claude/m3d/atlas.json','w'))
        print(len(atlas),'sprites',sum(len(v['src']) for v in atlas.values())//1024,'KB', errs); await b.close()
asyncio.run(main())
