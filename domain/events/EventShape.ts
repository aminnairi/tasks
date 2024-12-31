export interface EventShape<Type, Version, Data> {
  readonly identifier: string,
  readonly type: Type,
  readonly date: Date,
  readonly version: Version,
  readonly data: Data,
}