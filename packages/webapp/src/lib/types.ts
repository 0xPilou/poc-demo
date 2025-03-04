import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
};

export interface Pool {
  id: number;
  name: string;
  symbol: string;
  address: string; // pool contract address
  admin: string; // address
  superToken: string; // address
  tokenSymbol: string;
  tokenDecimals: number;
  flowRate: string; // BigNumber
  totalUnits: string; // BigNumber
  userUnits?: string; // BigNumber, optional as it depends on the connected user
  createdAt: number; // timestamp
}

export interface UserPoolData {
  poolId: number;
  units: string; // BigNumber
  claimableRewards: string; // BigNumber
  rewardsPerSecond: string; // BigNumber
}
