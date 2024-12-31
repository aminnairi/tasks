export interface Value<Type> {
  readonly value: Type;
  readonly is: (item: Value<Type>) => boolean
  readonly isValue: (value: Type) => boolean
}