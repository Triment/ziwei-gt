import { describe, it, expect } from 'vitest';
import { Plate, Character } from './index'
describe('宫位测试', () => {
    const character: Character = [
        {
            stem: '乙',
            branch: '亥'
        },
        {
            stem: '丁',
            branch: '亥'
        },
        {
            stem: '戊',
            branch: '辰'
        },
        {
            stem: '戊',
            branch: '午'
        }
    ];
    let plate = new Plate(character);
    it('八字安宫', () => {
        expect(plate.getPalaces()[0].stemBranch.stem).toBe('戊');
        expect(plate.getPalaces()[0].stemBranch.branch).toBe('子');
        expect(plate.getPalaces()[1].stemBranch.stem).toBe('己');
        expect(plate.getPalaces()[1].stemBranch.branch).toBe('丑');
    });
    it('命宫身宫', () => {
        expect(plate.getPalaces()[5].isMain).toBe(true);
        expect(plate.getPalaces()[5].isBody).toBe(true);

        //另起一个盘
        const character2: Character = [
            {
                stem: '丁',
                branch: '丑'
            },
            {
                stem: '辛',
                branch: '亥'
            },
            {
                stem: '壬',
                branch: '戌'
            },
            {
                stem: '癸',
                branch: '卯'
            }
        ];
        let plate2 = new Plate(character2);
        expect(plate2.getPalaces()[8].isMain).toBe(true);
        expect(plate2.getPalaces()[2].isBody).toBe(true);
    })
    it('定宫职', () => {
        expect(plate.getPalaces()[0].duty).toBe('疾厄');
        expect(plate.getPalaces()[1].duty).toBe('财帛');
        expect(plate.getPalaces()[2].duty).toBe('子女');
        expect(plate.getPalaces()[3].duty).toBe('夫妻');
    })
});
