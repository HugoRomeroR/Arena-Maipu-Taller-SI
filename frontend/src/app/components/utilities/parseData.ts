// src/app/components/utilities/ParseDate.ts

// Para "DD de mes de YYYY"
export function parseLargeDate(date: string) {
    if (date === null || date === '') {
        return 'Sin fecha'
    }
    try {
        const myDate = new Date(date);
        if (isNaN(myDate.getTime())) {
            throw new Error('date_err');
        }
        const largeDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(myDate);
        return largeDate;
    } catch {
        return 'Error en la fecha';
    }
};

// Para "DD/MM/YYYY"
export function parseShortDate(date: string) {
    if (date === null || date === '') {
        return 'Sin fecha'
    }
    try {
        const myDate = new Date(date);
        if (isNaN(myDate.getTime())) {
            throw new Error('date_err');
        }
        const day = myDate.getDate().toString().padStart(2, '0');
        const month = (myDate.getMonth() + 1).toString().padStart(2, '0');
        const year = myDate.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return 'Error en la fecha';
    }
};

// Devuelve un string con los dias que pasaron desde la fecha.
export function timeAgo(date: string, n: number) {
    if (date === null || date === '') {
        return 'Sin fecha'
    }
    try {
        const myDate = new Date(date);
        if (isNaN(myDate.getTime())) {
            throw new Error('date_err');
        }
        const nowDate = new Date();
        const deltaMs = nowDate.getTime() - myDate.getTime();

        const minutes = Math.floor(deltaMs / 60000);
        const hours = Math.floor(deltaMs / 3600000);
        const days = Math.floor(deltaMs / 86400000);

        if (days > n) {
            return parseLargeDate(date);
        } else if (days >= 1) {
            return `Hace ${days} día${days !== 1 ? 's' : ''}`;
        } else if (hours >= 1) {
            return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else {
            return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        }
    } catch {
        return 'Error en la fecha';
    }
}