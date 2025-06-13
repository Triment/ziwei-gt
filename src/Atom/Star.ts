export enum StarType {
  MAIN,
  YEAR,
  MONTH,
}


export type Star = {
  name: string;
  type: StarType;
}