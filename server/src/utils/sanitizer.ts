const SENSITIVE_KEYS = ['password', 'passwordConfirmation', 'token', 'secret', 'creditCard'];

export function sanitizePayload(payload: any): any {
    if (!payload || typeof payload !== 'object') return payload;

    // Check if it's a Buffer/Binary to avoid huge logs
    if (Buffer.isBuffer(payload)) return '[Buffer]';

    // Deep clone to avoid mutating original request body
    const sanitized = JSON.parse(JSON.stringify(payload));

    const mask = (obj: any) => {
        for (const key in obj) {
            if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
                obj[key] = '******'; // Redacted
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                mask(obj[key]); // Recurring
            }
        }
    };

    mask(sanitized);
    return sanitized;
}
