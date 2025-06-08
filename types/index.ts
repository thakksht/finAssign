export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  amount: number;
  date: Date;
  description: string;
}

export interface ChartData {
  month: string;
  amount: number;
}
