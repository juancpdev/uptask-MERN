export function formatDate(isoString: string) : string {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
    return formatter.format(date)
}