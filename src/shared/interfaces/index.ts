export default interface IDatabase {
  findById<Type>(table: string, id: number): Promise<Type | null>;
  get<Type>(table: string): Promise<Array<Type>>;
  create<Type, NewType>(table: string, data: NewType): Promise<Type>;
  update<Type>(table: string, id: number, data: Partial<Type>): Promise<Type>;
  delete<Type>(table: string, id: number): Promise<boolean>;
}