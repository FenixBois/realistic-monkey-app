export const formatDate = (date: Date) => {
    const dateOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    } as const;

    return date.toLocaleDateString('cs-CZ', dateOptions);
};
