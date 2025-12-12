export function scaleNumbers(numbers: number[], lowerLimit: number, upperLimit: number) {
    if (!numbers || numbers.length === 0) {
        return [];
    }

    // 1. Find the current range (min and max) of the input array
    const currentMin = Math.min(...numbers);
    const currentMax = Math.max(...numbers);

    // Check for the edge case where all numbers are the same
    if (currentMax === currentMin) {
        // If all numbers are identical, return an array where every element
        // is the midpoint of the new range, or the lower limit.
        const midpoint = (lowerLimit + upperLimit) / 2;
        return numbers.map(() => midpoint);
    }

    // 2. Calculate the size of the current and target ranges
    const currentRange = currentMax - currentMin;
    const targetRange = upperLimit - lowerLimit;

    // 3. Map each number to the new range
    const scaledNumbers = numbers.map((number) => {
        // a. Normalize the current number (position within the old range, 0 to 1)
        const normalizedValue = (number - currentMin) / currentRange;

        // b. Scale the normalized value to the new range size
        const scaledValue = normalizedValue * targetRange;

        // c. Shift the scaled value up by the new lower limit
        const finalValue = scaledValue + lowerLimit;

        return finalValue;
    });

    return scaledNumbers;
}