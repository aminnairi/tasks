export class ApplyError<AggregatedError> extends Error {
  public override readonly name = "ApplyError";

  public constructor(public readonly errors: AggregatedError[]) {
    super();
  }
}