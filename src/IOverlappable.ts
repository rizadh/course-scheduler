export interface IOverlappable<T> {
    overlaps(other: T): boolean;
}
