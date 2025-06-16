import { assert } from 'vitest';
import { Star, StarType } from './Atom/Star'
import {EightChar, SolarDay, SolarTime} from 'tyme4ts';
const GlobalBranch = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GlobalStem = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

const GLOBAL_DUTYS = [
  '命宫',
  '兄弟',
  '夫妻',
  '子女',
  '财帛',
  '疾厄',
  '迁移',
  '交友',
  '官禄',
  '田宅',
  '福德',
  '父母'
]
// 生日
export type Birthday = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  sex: 0|1;
}
// 干支
type StemBranch = {
  stem: string;
  branch: string;
}
// 宫位
interface Palace {
  stemBranch: StemBranch;
  isMain?: boolean;//是否为命宫
  isBody?: boolean;//是否为身宫
  isOrigin?: boolean;//是否为来因宫
  duty?: string;//本命宫位职责
  stars: Star[];
}

export enum FateNum {
  Water = 2,
  Wood = 3,
  Gold = 4,
  Soil = 5,
  Fire = 6
}

export class Plate {
  // 命局
  // 宫干顺序--必定顺时针排列
  // 宫职顺序--必定逆时针排列
  // 男女
  // 阴阳-决定顺逆
  // 命宫
  // 身宫
  // 八字 //八字的年干用于确定来因宫和生年四化
  private _palaces: Palace[] = [];//宫位
  public yinYang: boolean = false;//阴阳
  public fateType: FateNum = FateNum.Soil;//命数,命局
  public birthDay: Birthday = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    sex: 0
  };//出生时间
  public eightChar: EightChar | undefined;//八字
  constructor( birthday: Birthday ) {
    //获取农历时间
    let solar = SolarTime.fromYmdHms( birthday.year, birthday.month, birthday.day, birthday.hour, birthday.minute, birthday.second );
    let lunar = solar.getLunarHour();

    //获取八字
    let eightChar = lunar.getEightChar();
    this.eightChar = eightChar;
    // 出生时间
    this.birthDay = {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      hour: lunar.getHour(),
      minute: lunar.getMinute(),
      second: lunar.getSecond(),
      sex: birthday.sex
    }
    let yearStem = eightChar.getYear().getHeavenStem().toString();//年干
    let monthlyBranch = eightChar.getMonth().getEarthBranch().toString();//月支
    let hourBranch = eightChar.getHour().getEarthBranch().toString();//时支
    GlobalBranch.forEach( ( branch, _index ) => {
      this._palaces.push( {
        stemBranch: {
          stem: '',
          branch: branch
        },
        stars: []
      })
    });//初始化宫位
    //定12宫干
    let position = GlobalStem.indexOf(positionStem( yearStem )!);//起宫干的索引
    for ( let i = 0; i < 12; i++ ) {
      this._palaces[(i+2)%12].stemBranch.stem = GlobalStem[position%10];//卯宫开始安宫干
      if (GlobalStem[position%10] === yearStem) {
        this._palaces[(i+2)%12].isOrigin = true;//来因宫
      }
      position++;
    }
    //定阴阳
    this.yinYang = GlobalStem.indexOf(yearStem) % 2 === 0;
    //安命宫和身宫
    //命宫的起宫由寅宫起宫，虽然我们的宫是子宫开始的，但是不需要转换，因为我们索引也是从子宫开始的
    let mainIndex = Math.abs(GlobalBranch.indexOf(monthlyBranch) - GlobalBranch.indexOf(hourBranch))%12;
    let bodyIndex = (GlobalBranch.indexOf(monthlyBranch) + GlobalBranch.indexOf(hourBranch))%12;
    this._palaces[mainIndex].isMain = true;//命宫
    this._palaces[bodyIndex].isBody = true;//身宫
    //逆时针定宫职
    for ( let i = 12; i >= 1; i-- ) {
      this._palaces[(i+mainIndex)%12].duty = GLOBAL_DUTYS[12-i];
    }

    //掌心决定五行局
    this.fateType = deterMine(this._palaces[mainIndex].stemBranch);

    //安星
    this.setZiweiStars();
    this.setTianfuStars();
    this.setNianStars();
    this.setMoonStars();
    this.setHourStars();
  }

  //获取宫位
  public getPalaces(): Palace[] {
    return this._palaces;
  }

  public setZiweiStars() {
    let ziweiKey = 0;
    if (this.birthDay.day != 0 && 0 === this.birthDay.day % this.fateType) {
      ziweiKey = this.birthDay.day / this.fateType;
    } else if (this.birthDay.day != 0 && 0 !== this.birthDay.day % this.fateType) {
      let result = (Math.floor(this.birthDay.day / this.fateType) + 1) * this.fateType - this.birthDay.day;// frac{生日+x}{局数} = 商 // x = 商*局-生日
      if (result % 2 === 0) {
        ziweiKey = result + Math.floor(this.birthDay.day / this.fateType) + 1;
      } else {
        ziweiKey = Math.floor(this.birthDay.day / this.fateType) + 1 - result;
      }
    }
    type ZiweiKey =
  | '-8' | '-7' | '-6' | '-5' | '-4' | '-3' | '-2' | '-1'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15';

    const ziweiMap: Record<ZiweiKey, number> = {
      '-1': 0,
      '11': 0,
      '0': 1,
      '12': 1,
      '1': 2,
      '13': 2,
      '2': 3,
      '14': 3,
      '3': 4,
      '15': 4,
      '4': 5,
      '-8': 5,
      '5': 6,
      '-7': 6,
      '6': 7,
      '-6': 7,
      '7': 8,
      '-5': 8,
      '8': 9,
      '-4': 9,
      '9': 10,
      '-3': 10,
      '10': 11,
      '-2': 11,
    };

    let index: number = ziweiMap[ziweiKey.toString() as ZiweiKey];//紫微星的索引
    //逆行排六主星
    let sixStars: (Star|undefined)[] = [
      {
        name: '紫微星',
        type: StarType.MAIN,
      },
      {
        name: '天机',
        type: StarType.MAIN,
      }//紫微天机逆行旁
      ,,//隔一阳武天同当
      {
        name: '太阳',
        type: StarType.MAIN,
      },
      {
        name: '武曲',
        type: StarType.MAIN,
      },
      {
        name: '天同',
        type: StarType.MAIN,
      },
      ,,,//又隔二位廉贞地
      {
        name: '廉贞',
        type: StarType.MAIN,
      }
    ];

    for(const star of sixStars){
      if(star){
        this._palaces[index].stars.push(star);
      }
      index = (index+12-1)%12;//逆行排星
    }
  }
  public setTianfuStars() {
    //定位天府星
    let ziweiIndex = this._palaces.findIndex(palace => palace.stars.find(star => star.name === '紫微星'));
    let tianfuMap: Record<number, number> = {
      2: 2,
      8: 8,
      1: 3,
      0: 4,
      11: 5,
      10: 6,
      9: 7,
      3: 1,
      4: 0,
      5: 11,
      6: 10,
      7: 9
    };
    let tianfuIndex = tianfuMap[ziweiIndex];
    //南斗星 顺时针 天府 太阴 贪狼 巨门 天相 天粱 七杀 破军
    let eightStars = [
      {
        name: '天府',
        type: StarType.MAIN,
      },
      {
        name: '太阴',
        type: StarType.MAIN,
      },
      {
        name: '贪狼',
        type: StarType.MAIN,
      },
      {
        name: '巨门',
        type: StarType.MAIN,
      },
      {
        name: '天相',
        type: StarType.MAIN,
      },
      {
        name: '天粱',
        type: StarType.MAIN,
      },
      {
        name: '七杀',
        type: StarType.MAIN,
      },,,,
      {
        name: '破军',
        type: StarType.MAIN,
      },
    ];
    for (const star of eightStars) {
      if(star){
        this._palaces[tianfuIndex].stars.push(star);
      }
      tianfuIndex = (tianfuIndex+1)%12;
    }
  }

  //安年星
  public setNianStars(){
    let stem = this.eightChar!.getYear().getHeavenStem().toString();
    let index = this._palaces.findIndex(palace => palace.stemBranch.stem === stem)!;
    this._palaces[index].stars.push({
      name: '安年',
      type: StarType.YEAR,
    });
    index = (index+12-1)%12;
    this._palaces[index].stars.push({
      name: '陀螺',
      type: StarType.YEAR,
    });
    index = (index+12+2)%12;
    this._palaces[index].stars.push({
      name: '擎羊',
      type: StarType.YEAR,
    });
    //安天魁星、天钺星
    let kuiYueMap: Record<string, string[]> = {
      '甲': ['丑', '未'],
      '戊': ['丑', '未'],
      '庚': ['丑', '未'],
      '乙': ['子', '申'],
      '己': ['子', '申'],
      '丙': ['亥', '酉'],
      '丁': ['亥', '酉'],
      '辛': ['午', '寅'],
      '壬': ['卯', '巳'],
      '癸': ['卯', '巳'],
    };
    this._palaces.find(palace => palace.stemBranch.branch === kuiYueMap[stem][0])!.stars.push({
      name: '天钺',
      type: StarType.YEAR,
    });
    this._palaces.find(palace => palace.stemBranch.branch === kuiYueMap[stem][1])!.stars.push({
      name: '天魁',
      type: StarType.YEAR,
    });

    //红鸾天喜
    //获取卯宫位置(index+12-1)%12
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === '卯');
    const count = GlobalBranch.findIndex(branch => branch === this.eightChar?.getYear().getEarthBranch().toString());//年支的索引
    //console.log(count)
    index = (index+12-count )%12;
    this._palaces[index].stars.push({
      name: '红鸾',
      type: StarType.YEAR,
    });
    //天喜
    index = (index+12+6)%12;//天喜在对宫
    this._palaces[index].stars.push({
      name: '天喜',
      type: StarType.YEAR,
    });
  }

  public setMoonStars(){
    //左辅星： 由辰宫起， 顺数生月。 右弼星： 由戌宫起， 逆数生月。例：五月生人，左辅星在申宫，右弼星在午宫
    let count = this.birthDay.month - 1;//月份从0开始
    let index = this._palaces.findIndex(palace => palace.stemBranch.branch === '辰');
    index = (index+count )%12;
    this._palaces[index].stars.push({
      name: '左辅',
      type: StarType.MONTH,
    });
    //右弼
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === '戌');
    index = (index+12-count )%12;
    this._palaces[index].stars.push({
      name: '右弼',
      type: StarType.MONTH,
    });
    //天刑星： 由酉宫起， 顺数生月。 天姚星： 由丑宫起， 顺数生月
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === '酉');
    index = (index+count )%12;
    this._palaces[index].stars.push({
      name: '天刑',
      type: StarType.MONTH,
    });
    //天姚
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === '丑');
    index = (index+count )%12;
    //console.log(this._palaces[index].stemBranch.branch)
    this._palaces[index].stars.push({
      name: '天姚',
      type: StarType.MONTH,
    });
    //天马星：分年马及月马两种，唯年马仅主驿马之意，而月马主驿马且主财马，故有财马之称。月马以出生月令排布，皆落于寅申巳亥四马之地
    let tianmaMap: Record<number, string> = {
      2: '巳',
      6: '巳',
      10: '巳',
      1: '申',
      5: '申',
      9: '申',
      3: '寅',
      7: '寅',
      11: '寅',
      4: '亥',
      8: '亥',
      12: '亥'
    };

    let tianmaBranch = tianmaMap[this.birthDay.month];
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === tianmaBranch);
    this._palaces[index].stars.push({
      name: '天马',
      type: StarType.MONTH,
    });
  }

  public setHourStars() {
    //文昌：由戌宫起，逆数出生时辰
//文曲：由辰宫起，顺数出生时辰
    let count = GlobalBranch.findIndex(branch => branch === this.eightChar?.getHour().getEarthBranch().toString());
    let index = this._palaces.findIndex(palace => palace.stemBranch.branch === '戌');
    index = (index+12-count )%12;
    this._palaces[index].stars.push({
      name: '文昌',
      type: StarType.HOUR,
    });
    //文曲
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === '辰');
    index = (index+count )%12;
    this._palaces[index].stars.push({
      name: '文曲',
      type: StarType.HOUR,
    });
    //安火星：依生年支与生时顺排
    /**
     * ①寅午戌年生人，由丑宫起，顺数生时。
②申子辰年生人，由寅宫起，顺数生时。
③巳酉丑年生人，由卯宫起，顺数生时。
④亥卯未年生人，由酉宫起，顺数生时。
     */
    let huoMap: Record<string, string> = {
      '寅': '丑',
      '午': '丑',
      '戌': '丑',
      '申': '寅',
      '子': '寅',
      '辰': '寅',
      '巳': '卯',
      '酉': '卯',
      '丑': '卯',
      '亥': '酉',
      '未': '酉',
    };
    let huoBranch = huoMap[this.eightChar!.getYear().getEarthBranch().toString()];
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === huoBranch);
    let hour = this.eightChar!.getHour().getEarthBranch().toString();
    let hourIndex = GlobalBranch.findIndex(branch => branch === hour);
    index = (index+hourIndex )%12;
    this._palaces[index].stars.push({
      name: '火星',
      type: StarType.HOUR,
    });
    //安铃星：由寅宫起，顺数生时
    /**
     * 安铃星：依生年支与生时顺排，分二组如下：
①寅午戌年生人，由卯宫起，顺数生时。
②其他年生人，皆由戌宫起，顺数生时。
     */
    let lingMap: Record<string, string> = {
      '寅': '卯',
      '午': '卯',
      '戌': '卯',
      '申': '戌',
      '子': '戌',
      '辰': '戌',
      '巳': '戌',
      '酉': '戌',
      '丑': '戌',
      '亥': '戌',
      '未': '戌',
      '卯': '戌',
    };
    let lingBranch = lingMap[this.eightChar!.getYear().getEarthBranch().toString()];
    index = this._palaces.findIndex(palace => palace.stemBranch.branch === lingBranch);
    hourIndex = GlobalBranch.findIndex(branch => branch === hour);
    index = (index+hourIndex )%12;
    this._palaces[index].stars.push({
      name: '铃星',
      type: StarType.HOUR,
    });
  }

  //四化
  
}


//掌心决定五行局
function deterMine( stemBranch: StemBranch ): FateNum {
  let fiveElements = [FateNum.Gold, FateNum.Water, FateNum.Fire, FateNum.Soil, FateNum.Wood];
  let i = 0;
  for (let stem of ['甲乙', '丙丁', '戊己', '庚辛', '壬癸']){
    if(stem.includes(stemBranch.stem)){
      //三个连续定点数地支
      let threeElements = [];
      for (let j = 0; j < 3; j++){
        threeElements.push(fiveElements[(i+j)%5]);
      }
      let k = 0;
      for (let branch of ['子丑', '寅卯', '辰巳', '午未', '申酉', '戌亥']){
        if(branch.includes(stemBranch.branch)){
          return threeElements[k%3];
        }
        k++;
      }
    }
    i++;
  }
  return FateNum.Soil;
}

//函数用于定位十二宫干
function positionStem( yearStem: string ): string | undefined {
  const _stems = [ '丙', '戊', '庚', '壬', '甲' ];
  for ( let i = 0; i < 5; i++ ) {
    if ([GlobalStem[i], GlobalStem[i + 5]].includes( yearStem )) {
      return _stems[i];
    }
  }
}