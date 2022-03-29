const dateFormat = new Intl.DateTimeFormat('en', {year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit"})

export const formatName = (user) => {
    return `${user.firstName} ${user.lastName}`;
};

export const formatDate =(dateStr) => {
    const date = new Date(dateStr);
    return dateFormat.format(date);
}