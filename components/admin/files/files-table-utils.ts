export function getFileType(fileName: string) {
    return (
        fileName
            .split(".")
            .pop()
            ?.toUpperCase() || "FILE"
    );
}

export function getTypeClass(type: string) {
    switch (type) {
        case "PDF":
            return "bg-red-50 text-red-700 border-red-200";

        case "DOC":
        case "DOCX":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "XLS":
        case "XLSX":
            return "bg-green-50 text-green-700 border-green-200";

        case "PNG":
        case "JPG":
        case "JPEG":
        case "WEBP":
            return "bg-violet-50 text-violet-700 border-violet-200";

        case "ZIP":
        case "RAR":
            return "bg-amber-50 text-amber-700 border-amber-200";

        default:
            return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
}

export function formatSize(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} Б`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} КБ`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
    }

    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} ГБ`;
}

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
        "ru-RU",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        },
    );
}