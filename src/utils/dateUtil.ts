export function simplifiedYearMonthDate(time: number) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const formattedDate = formatter.format(time);
    return formattedDate.replace(/-/g, '');
}

export function simplifiedYearMonth(time: number) {
    const yyyymmdd = simplifiedYearMonthDate(time)
    return yyyymmdd.substring(0, 6);
}

export function simplifiedYearMonthWeek(time: number) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const formattedDate = formatter.format(time);
    const [year, month, dayStr] = formattedDate.split('-');

    const dayNumber = parseInt(dayStr!, 10);
    const weekNumber = Math.ceil(dayNumber / 7);

    const ww = weekNumber.toString().padStart(2, '0');

    return `${year}${month}${ww}`;
}
