export function formatNames(names: string[]): string {
    const count = names.length;

    if (count === 0) {
        return "";
    }

    if (count === 1) {
        return names[0];
    }

    if (count === 2) {
        // Join the two names with " and "
        return `${names[0]} and ${names[1]}`;
    }

    // Handle three or more names
    // 1. Get all names except the last one and join them with ", "
    const initialNames = names.slice(0, count - 1).join(", ");

    // 2. Get the last name
    const lastName = names[count - 1];

    // 3. Combine them using the Oxford comma (optional, but good practice) and " and "
    return `${initialNames}, and ${lastName}`;
}

export function countDaysBetweenDates(date1: Date, date2: Date): number {
    // Define the number of milliseconds in one day
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    // 1. Calculate the difference in milliseconds
    // We use Math.abs() to ensure the result is positive, regardless of the order of dates.
    const timeDifference_ms = Math.abs(date2.getTime() - date1.getTime());

    // 2. Convert the difference from milliseconds to days
    // Math.floor() is used to return the count of full 24-hour periods.
    const daysDifference = Math.floor(timeDifference_ms / MS_PER_DAY);

    return daysDifference;
}