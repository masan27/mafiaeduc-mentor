export default function StatusBadge({
    status,
    trueText,
    falseText,
    className = '',
}) {
    return (
        <span
            className={`px-4 py-1 text-white rounded-full text-xs ${
                status ? 'bg-green-500' : 'bg-red-500'
            } ${className}`}
        >
            {status
                ? trueText
                    ? trueText
                    : 'Aktif'
                : falseText
                ? falseText
                : 'Tidak Aktif'}
        </span>
    );
}
