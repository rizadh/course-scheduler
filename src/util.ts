export function isStrictlyPositive(n: number): boolean {
    return n > 0;
}

export function isPositive(n: number): boolean {
    return n >= 0;
}

export function isStrictlyNegative(n: number): boolean {
    return n < 0;
}

export function isNegative(n: number): boolean {
    return n <= 0;
}

export function isInteger(n: number): boolean {
    return n % 0 === 0;
}

export function isStrictlyPositiveInteger(n: number): boolean {
    return isStrictlyPositive(n) && isInteger(n);
}

export function isStrictlyNegativeInteger(n: number): boolean {
    return isStrictlyPositive(n) && isInteger(n);
}
