export type Product={id:string;name:string;en:string;model:string;category:string;price:number;moq:number;stock:number;material:string;coating:string;size:string;color:string;tag?:string};
export const categories=[['车削刀具','外圆、内孔、切断切槽'],['铣削刀具','立铣、面铣、球头铣'],['孔加工刀具','钻削、铰削、镗削'],['螺纹刀具','丝锥、螺纹铣刀'],['可转位刀片','车削、铣削、钻削刀片'],['刀柄与附件','ER、液压、热缩刀柄']];
const base=[
['PT-TNMG1604','精密负前角车削刀片','Precision Turning Insert','可转位刀片',38,10,826,'硬质合金','TiAlN','16×9.5×4.8 mm','#d9b24c','热销'],
['EM-4F-D10','四刃硬质合金立铣刀','4-Flute Carbide End Mill','铣削刀具',168,2,148,'硬质合金','TiSiN','D10×25×75 mm','#8092a5','新品'],
['FM-APKT50','可转位精密面铣刀盘','Indexable Face Mill','铣削刀具',680,1,36,'合金钢','氮化','D50 / 4齿','#526b7e','工业优选'],
['DR-5D-D8','内冷整体硬质合金钻头','Coolant Carbide Drill','孔加工刀具',286,2,64,'硬质合金','TiAlN','D8×5D','#46687c','热销'],
['TH-M12','高性能螺旋槽机用丝锥','Spiral Flute Machine Tap','螺纹刀具',126,3,92,'高速钢','TiCN','M12×1.75','#607b8d'],
['HSK-A63-HC20','HSK 高精度液压刀柄','HSK Hydraulic Chuck','刀柄与附件',1880,1,12,'合金钢','防锈处理','HSK-A63 / 20','#334d5c','精密级'],
['CBN-CNGA1204','淬硬钢精加工 CBN 刀片','CBN Finishing Insert','可转位刀片',298,2,24,'CBN','无','CNGA120408','#363e47'],
['ER32-15PCS','ER32 高精度筒夹套装','ER32 Collet Set','刀柄与附件',498,1,58,'弹簧钢','防锈处理','3–20 mm / 15件','#718192','套装']
] as const;
export const products:Product[]=Array.from({length:40},(_,i)=>{const x=base[i%base.length];return{id:`p${i+1}`,model:i<8?x[0]:`${x[0]}-${String(i+1).padStart(2,'0')}`,name:x[1],en:x[2],category:x[3],price:x[4]+Math.floor(i/8)*12,moq:x[5],stock:Math.max(0,x[6]-i*2),material:x[7],coating:x[8],size:x[9],color:x[10],tag:x[11]}});
export const getProduct=(id?:string)=>products.find(p=>p.id===id)||products[0];
