export enum StarType {
  MAIN,
  YEAR,
  MONTH,
  HOUR
}

enum StarChangeType {
  INNER,
  OUTER
}

export type Star = {
  name: string;
  type: StarType;
}