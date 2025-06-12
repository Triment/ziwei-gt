import { describe, it, expect } from 'vitest';
import { Plate, FateNum, Birthday } from './index'
describe('宫位测试', () => {
    const birthday: Birthday = {
        year: 1995,
        month: 12,
        day: 3,
        hour: 12,
        minute: 45,
        second: 0
    };
    let plate = new Plate(birthday);
    //另起一个盘
    const birthday2: Birthday = {
        year: 1997,
        month: 11,
        day: 16,
        hour: 5,
        minute: 44,
        second: 0
    };
    let plate2 = new Plate(birthday2);
    it('八字安宫', () => {
        expect(plate.getPalaces()[0].stemBranch.stem).toBe('戊');
        expect(plate.getPalaces()[0].stemBranch.branch).toBe('子');
        expect(plate.getPalaces()[1].stemBranch.stem).toBe('己');
        expect(plate.getPalaces()[1].stemBranch.branch).toBe('丑');
    });
    it('命宫身宫', () => {
        expect(plate.getPalaces()[5].isMain).toBe(true);
        expect(plate.getPalaces()[5].isBody).toBe(true);
        expect(plate2.getPalaces()[8].isMain).toBe(true);
        expect(plate2.getPalaces()[2].isBody).toBe(true);
    })
    it('定宫职', () => {
        expect(plate.getPalaces()[0].duty).toBe('疾厄');
        expect(plate.getPalaces()[1].duty).toBe('财帛');
        expect(plate.getPalaces()[2].duty).toBe('子女');
        expect(plate.getPalaces()[3].duty).toBe('夫妻');

        expect(plate2.getPalaces()[0].duty).toBe('官禄');
        expect(plate2.getPalaces()[1].duty).toBe('交友');
        expect(plate2.getPalaces()[2].duty).toBe('迁移');
        expect(plate2.getPalaces()[3].duty).toBe('疾厄');
    })
    it('五行局', () => {
        expect(plate.fateType).toBe(FateNum.Gold);//金盘
        expect(plate2.fateType).toBe(FateNum.Soil)//土盘
    })
});
