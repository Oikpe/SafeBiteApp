import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

// ─── 1. Gluten (Wheat Stalk) ───
export const IconGluten = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C12 2 15.5 5.5 15.5 10C15.5 12.5 14 15 12 16.5C10 15 8.5 12.5 8.5 10C8.5 5.5 12 2 12 2ZM9.5 16.8C9.5 16.8 6.5 13.5 6.5 10.5C6.5 8.5 7.5 7 7.5 7C7.5 7 10.5 10.5 10.5 13.5C10.5 15 9.5 16.8 9.5 16.8ZM14.5 16.8C14.5 16.8 17.5 13.5 17.5 10.5C17.5 8.5 16.5 7 16.5 7C16.5 7 13.5 10.5 13.5 13.5C13.5 15 14.5 16.8 14.5 16.8ZM12 16.5V22H10.5V17.5C11 17 11.5 16.7 12 16.5Z" />
    </svg>
);

// ─── 2. Crustaceans (Crab) ───
export const IconCrab = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 8.5C9.5 8.5 7.5 10.2 7 12.5L5 11.5L4.5 13L6.5 14C6.5 14.5 6.2 15 5.5 15L4 14.5L3.5 16L5 16.5C5.5 17.5 7.5 18 12 18C16.5 18 18.5 17.5 19 16.5L20.5 16L20 14.5L18.5 15C17.8 15 17.5 14.5 17.5 14L19.5 13L19 11.5L17 12.5C16.5 10.2 14.5 8.5 12 8.5ZM7.5 6.5C7.5 5.5 6.5 4.5 6.5 4.5C8.5 4.5 9 5.5 9.5 6.5C8.8 6.8 8.2 7.2 7.8 8C7.5 7.5 7.5 7 7.5 6.5ZM16.5 6.5C16.5 5.5 17.5 4.5 17.5 4.5C15.5 4.5 15 5.5 14.5 6.5C15.2 6.8 15.8 7.2 16.2 8C16.5 7.5 16.5 7 16.5 6.5ZM10 11C10.6 11 11 11.4 11 12C11 12.6 10.6 13 10 13C9.4 13 9 12.6 9 12C9 11.4 9.4 11 10 11ZM14 11C14.6 11 15 11.4 15 12C15 12.6 14.6 13 14 13C13.4 13 13 12.6 13 12C13 11.4 13.4 11 14 11Z" />
    </svg>
);

// ─── 3. Fish ───
export const IconFish = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 6C7.5 6 4.5 8.5 3.5 10.5C2 10 2 8 2 8C2.5 10.5 2 13 2 13C2 13 3 11 4.5 11C5 13 7.5 16 12 16C17.5 16 20.5 13.5 22 11C20.5 8.5 17.5 6 12 6ZM17 10C16.4 10 16 9.6 16 9C16 8.4 16.4 8 17 8C17.6 8 18 8.4 18 9C18 9.6 17.6 10 17 10ZM7.5 13.5L9.5 14.5L13.5 11.5L12.5 9.5L7.5 13.5Z" />
    </svg>
);

// ─── 4. Eggs (Cracked Egg) ───
export const IconEggs = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 3C8 3 5 8 5 13C5 17 8 21 12 21C16 21 19 17 19 13C19 8 16 3 12 3ZM12 4.5C14.5 4.5 16 7.5 16.8 10L14 11L12.5 9L11 11.5L8.5 10.5L7.2 12C7.1 11 7 9.5 7 8C7.5 5.5 9.5 4.5 12 4.5ZM12 19.5C9.5 19.5 7.5 17.5 6.8 14.5L9.5 12.5L11 14L13 11.5L15 13L17.2 12C17.4 13.5 17 16.5 14.5 18C13.5 18.8 12.5 19.5 12 19.5Z" />
    </svg>
);

// ─── 5. Milk (Dairy Bottle) ───
export const IconMilk = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M9 2H15V4H14V6L16 9V20C16 21.1 15.1 22 14 22H10C8.9 22 8 21.1 8 20V9L10 6V4H9V2ZM10.5 7V4.5H13.5V7L14.5 8.5H9.5L10.5 7ZM9.5 20H14.5V10.5H9.5V20Z" />
    </svg>
);

// ─── 6. Soy (Pod with Beans) ───
export const IconSoy = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M4 18C4 18 2 11 7 6C12 1 19 3 19 3C19 3 21 10 16 15C11 20 4 18 4 18ZM7 15C8.1 15 9 14.1 9 13C9 11.9 8.1 11 7 11C5.9 11 5 11.9 5 13C5 14.1 5.9 15 7 15ZM11 11C12.1 11 13 10.1 13 9C13 7.9 12.1 7 11 7C9.9 7 9 7.9 9 9C9 10.1 9.9 11 11 11ZM16 14C17.1 14 18 13.1 18 12C18 10.9 17.1 10 16 10C14.9 10 14 10.9 14 12C14 13.1 14.9 14 16 14Z" />
    </svg>
);

// ─── 7. Sesame (Seeds) ───
export const IconSesame = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C12 2 15 6 15 10C15 11.7 13.7 13 12 13C10.3 13 9 11.7 9 10C9 6 12 2 12 2ZM6.5 11C6.5 11 9.5 15 9.5 19C9.5 20.7 8.2 22 6.5 22C4.8 22 3.5 20.7 3.5 19C3.5 15 6.5 11 6.5 11ZM17.5 11C17.5 11 20.5 15 20.5 19C20.5 20.7 19.2 22 17.5 22C15.8 22 14.5 20.7 14.5 19C14.5 15 17.5 11 17.5 11Z" />
    </svg>
);

// ─── 8. Peanuts (Shell) ───
export const IconPeanuts = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M14 3C11.5 3 9.7 4.5 9 6.5C8 6.5 7 7 6 8C4.5 9.5 4.5 12.5 6 14C7 15 8 15.5 9 15.5C9.7 17.5 11.5 19 14 19C16.5 19 19.5 17.5 19.5 14C19.5 12 18.5 11 17 11C18.5 11 19.5 10 19.5 8C19.5 4.5 16.5 3 14 3ZM7.5 9.5C8.3 8.7 9.5 8.7 10 9.5C10.5 10.3 10.5 11.5 9.5 12C8.5 12.5 7.5 12 7 11C6.5 10 6.7 10.3 7.5 9.5ZM14 17.5C12 17.5 10.5 16 10.5 14C10.5 12 12 10.5 14 10.5C16 10.5 17.5 12 17.5 14C17.5 16 16 17.5 14 17.5ZM14 4.5C16 4.5 17.5 6 17.5 8C17.5 10 16 11.5 14 11.5C12 11.5 10.5 10 10.5 8C10.5 6 12 4.5 14 4.5Z" />
    </svg>
);

// ─── 9. Sulfites (Flask) ───
export const IconSulfites = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M14 2H10V4H11V8L6 18V22H18V18L13 8V4H14V2ZM8 17L11 11V9H13V11L16 17H8ZM14 18.5C14 18.5 13 20 12 20C11 20 10 18.5 10 18.5C10 18.5 11 18.5 12 18.5C13 18.5 14 18.5 14 18.5Z" />
    </svg>
);

// ─── 10. Mustard (Squirt Bottle) ───
export const IconMustard = ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M13 2H11L10 6H14L13 2ZM9 7L8 10V22H16V10L15 7H9ZM10.5 12H13.5V13.5H10.5V12ZM10.5 15H13.5V16.5H10.5V15ZM10.5 18H13.5V19.5H10.5V18Z" />
    </svg>
);
