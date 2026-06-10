/**
 * Strip HTML tags and script content from a string.
 */
export function stripHtml(input: string): string {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]*>/g, "")
        .trim();
}

/** Sanitize email input. */
export function sanitizeEmail(email: string): string {
    const cleaned = email.trim().toLowerCase();
    // Basic RFC validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleaned)) {
        throw new Error("Invalid email format");
    }
    return cleaned;
}

/** Sanitize display name. */
export function sanitizeDisplayName(name: string): string {
    return stripHtml(name)
        .replace(/[\x00-\x1F\x7F]/g, "") // Remove control chars
        .substring(0, 50)
        .trim();
}

/** Sanitize search query for food scanning. */
export function sanitizeSearchQuery(query: string): string {
    return stripHtml(query)
        .replace(/[\x00-\x1F\x7F]/g, "")  // Remove control chars
        .replace(/[;'"\\]/g, "")            // Remove SQL metacharacters
        .substring(0, 200)
        .trim();
}

/** Validate password constraints. */
export function validatePassword(password: string): {
    valid: boolean;
    error: string | null;
} {
    if (password.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters" };
    }
    if (password.length > 128) {
        return { valid: false, error: "Password must be less than 128 characters" };
    }
    // Check for at least one letter and one number
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return {
            valid: false,
            error: "Password must contain at least one letter and one number",
        };
    }
    return { valid: true, error: null };
}
