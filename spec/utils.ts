type Transformer = (x: string) => string;
export function formatName(
    first: string,
    last: string,
    transformer: Transformer = (x) => x): string {
    return transformer(`${last}, ${first}`);
}