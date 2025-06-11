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
}

enum FateNum {
  Water = 2,
  Wood = 3,
  Gold = 4,
  Soil = 5,
  Fire = 6
}
//八字
export type Character = StemBranch[]

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
  constructor( character: Character ) {
    let yearStem = character[0].stem;//年干
    let monthlyBranch = character[1].branch;//月支
    let hourBranch = character[3].branch;//时支
    GlobalBranch.forEach( ( branch, _index ) => {
      this._palaces.push( {
        stemBranch: {
          stem: '',
          branch: branch
        },
        isOrigin: branch === yearStem //是否来因宫
      })
    });//初始化宫位
    //定12宫干
    let position = GlobalStem.indexOf(positionStem( yearStem )!);//起宫干的索引 
    for ( let i = 0; i < 12; i++ ) {
      this._palaces[(i+3)%12].stemBranch.stem = GlobalStem[position%10];//卯宫开始安宫干
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
    for ( let i = 12; i > 1; i-- ) {
      this._palaces[(i+mainIndex)%12].duty = GLOBAL_DUTYS[12-i];
    }
  }

  //获取宫位
  public getPalaces(): Palace[] {
    return this._palaces;
  }
}


//函数用于定位十二宫干
function positionStem( yearStem: string ): string | undefined {
  const _stems = [ '丁', '己', '庚', '辛', '乙' ];
  for ( let i = 0; i < 5; i++ ) {
    if ([GlobalStem[i], GlobalStem[i + 5]].includes( yearStem )) {
      return _stems[i];
    }
  }
}