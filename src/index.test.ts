import { describe, it, expect } from 'vitest';
import { Plate, FateNum, Birthday } from './index'
import { StarType } from './Atom/Star';
describe('宫位测试', () => {
    const birthday: Birthday = {
        year: 1995,
        month: 12,
        day: 3,
        hour: 12,
        minute: 45,
        second: 0,
        sex: 0
    };
    let plate = new Plate(birthday);
    //另起一个盘
    const birthday2: Birthday = {
        year: 1997,
        month: 11,
        day: 16,
        hour: 5,
        minute: 44,
        second: 0,
        sex: 0
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
        expect(plate.getPalaces()[6].duty).toBe('父母');


        expect(plate2.getPalaces()[0].duty).toBe('官禄');
        expect(plate2.getPalaces()[1].duty).toBe('交友');
        expect(plate2.getPalaces()[2].duty).toBe('迁移');
        expect(plate2.getPalaces()[3].duty).toBe('疾厄');
        expect(plate2.getPalaces()[9].duty).toBe('父母');

    })
    it('五行局', () => {
        expect(plate.fateType).toBe(FateNum.Gold);//金盘
        expect(plate2.fateType).toBe(FateNum.Soil)//土盘
    })

    it('定位紫微星', () => {
        expect(plate.getPalaces()[4].stars.find(star => star.name === '紫微星')?.type).toBe(StarType.MAIN);
        expect(plate2.getPalaces()[2].stars.find(star => star.name === '紫微星')?.type).toBe(StarType.MAIN);
    })
    it('定位天机', () => {
        expect(plate.getPalaces()[3].stars.find(star => star.name === '天机')?.type).toBe(StarType.MAIN);
        expect(plate2.getPalaces()[1].stars.find(star => star.name === '天机')?.type).toBe(StarType.MAIN);
    })
    //定位太阳
    it('定位太阳', () => {
        expect(plate.getPalaces()[1].stars.find(star => star.name === '太阳')?.type).toBe(StarType.MAIN);
        expect(plate2.getPalaces()[11].stars.find(star => star.name === '太阳')?.type).toBe(StarType.MAIN);
    })
    //定位天府
    it('定位天府', () => {
        expect(plate.getPalaces()[0].stars.find(star => star.name === '天府')?.type).toBe(StarType.MAIN);
        expect(plate2.getPalaces()[2].stars.find(star => star.name === '天府')?.type).toBe(StarType.MAIN);
    })
    //定位武曲
    it('定位武曲', () => {
        expect(plate.getPalaces()[0].stars.find(star => star.name === '武曲')?.type).toBe(StarType.MAIN);
        expect(plate.getPalaces()[0].stemBranch.stem).toBe('戊');
        expect(plate.getPalaces()[0].stemBranch.branch).toBe('子');
        expect(plate2.getPalaces()[10].stars.find(star => star.name === '武曲')?.type).toBe(StarType.MAIN);
        expect(plate2.getPalaces()[10].stemBranch.stem).toBe('庚');
        expect(plate2.getPalaces()[10].stemBranch.branch).toBe('戌');
    })

    it('定位年星', () => {
        expect(plate.getPalaces()[4].stars.find(star => star.name === '红鸾')?.type).toBe(StarType.YEAR);
        // expect(plate.getPalaces()[4].stemBranch.stem).toBe('庚');
        // expect(plate.getPalaces()[4].stemBranch.branch).toBe('辰');
        expect(plate.getPalaces()[10].stars.find(star => star.name === '天喜')?.type).toBe(StarType.YEAR);
        expect(plate.getPalaces()[3].stars.find(star => star.name === '禄存')?.type).toBe(StarType.YEAR);
        //console.log(plate2.getPalaces()[2].stars)
        expect(plate2.getPalaces()[2].stars.find(star => star.name === '红鸾')?.type).toBe(StarType.YEAR);
        // expect(plate.getPalaces()[4].stemBranch.stem).toBe('庚');
        // expect(plate.getPalaces()[4].stemBranch.branch).toBe('辰');
        expect(plate2.getPalaces()[8].stars.find(star => star.name === '天喜')?.type).toBe(StarType.YEAR);
        expect(plate2.getPalaces()[6].stars.find(star => star.name === '禄存')?.type).toBe(StarType.YEAR);
    })
    it('定位月星', () => {
        expect(plate.getPalaces()[1].stars.find(star => star.name === '左辅')?.type).toBe(StarType.MONTH);
        expect(plate.getPalaces()[1].stars.find(star => star.name === '右弼')?.type).toBe(StarType.MONTH);
        expect(plate.getPalaces()[6].stars.find(star => star.name === '天刑')?.type).toBe(StarType.MONTH);
        expect(plate.getPalaces()[10].stars.find(star => star.name === '天姚')?.type).toBe(StarType.MONTH);
        expect(plate.getPalaces()[5].stars.find(star => star.name === '天马')?.type).toBe(StarType.MONTH);

        expect(plate2.getPalaces()[1].stars.find(star => star.name === '左辅')?.type).toBe(StarType.MONTH);
        expect(plate2.getPalaces()[1].stars.find(star => star.name === '右弼')?.type).toBe(StarType.MONTH);
        expect(plate2.getPalaces()[6].stars.find(star => star.name === '天刑')?.type).toBe(StarType.MONTH);
        expect(plate2.getPalaces()[10].stars.find(star => star.name === '天姚')?.type).toBe(StarType.MONTH);
        expect(plate2.getPalaces()[5].stars.find(star => star.name === '天马')?.type).toBe(StarType.MONTH);
    })

    it('定位时星', () => {
        expect(plate.getPalaces()[3].stars.find(star => star.name === '火星')?.type).toBe(StarType.HOUR);
        expect(plate.getPalaces()[4].stars.find(star => star.name === '铃星')?.type).toBe(StarType.HOUR);
        expect(plate.getPalaces()[4].stars.find(star => star.name === '文昌')?.type).toBe(StarType.HOUR);
        expect(plate.getPalaces()[10].stars.find(star => star.name === '文曲')?.type).toBe(StarType.HOUR);

        expect(plate2.getPalaces()[6].stars.find(star => star.name === '火星')?.type).toBe(StarType.HOUR);
        expect(plate2.getPalaces()[1].stars.find(star => star.name === '铃星')?.type).toBe(StarType.HOUR);
        expect(plate2.getPalaces()[7].stars.find(star => star.name === '文昌')?.type).toBe(StarType.HOUR);
        expect(plate2.getPalaces()[7].stars.find(star => star.name === '文曲')?.type).toBe(StarType.HOUR);
    })

    it('来因宫', () => {
        expect(plate.getPalaces()[9].isOrigin).toBe(true);
        expect(plate2.getPalaces()[7].isOrigin).toBe(true);
    })
});
