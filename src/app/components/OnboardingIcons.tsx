import { Shield, Leaf, ClipboardCheck, Scan, Camera, ReceiptText, Users, ShieldCheck } from "lucide-react";

interface IconProps {
    size?: number;
    className?: string;
    badgeContainerColor?: string;
    badgeIconColor?: string;
}

export const SafeToEatIcon = ({ size = 68, className = "", badgeContainerColor = "bg-white", badgeIconColor = "text-emerald-500" }: IconProps) => (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Shield size={size} className="text-white relative z-10" strokeWidth={1.5} />
        <Leaf size={size * 0.45} className="text-white absolute z-20" strokeWidth={1.5} style={{ top: '25%' }} fill="currentColor" />
        <div
            className={`absolute z-30 ${badgeContainerColor} rounded-xl flex items-center justify-center shadow-lg`}
            style={{ right: '-15%', bottom: '-5%', width: size * 0.55, height: size * 0.55 }}
        >
            <ClipboardCheck size={size * 0.35} className={badgeIconColor} strokeWidth={2.5} />
        </div>
    </div>
);

export const ScanMenuIcon = ({ size = 68, className = "", badgeContainerColor = "bg-white", badgeIconColor = "text-indigo-500" }: IconProps) => (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Scan size={size * 1.1} className="text-white absolute z-10" strokeWidth={1.5} />
        <Camera size={size * 0.5} className="text-white absolute z-20" strokeWidth={1.5} />
        <div
            className={`absolute z-30 ${badgeContainerColor} rounded-xl flex items-center justify-center shadow-lg`}
            style={{ right: '-5%', bottom: '-10%', width: size * 0.55, height: size * 0.55 }}
        >
            <ReceiptText size={size * 0.35} className={badgeIconColor} strokeWidth={2.5} />
        </div>
    </div>
);

export const ProtectFamilyIcon = ({ size = 68, className = "", badgeContainerColor = "bg-white", badgeIconColor = "text-violet-500" }: IconProps) => (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Users size={size * 0.9} className="text-white absolute z-10" strokeWidth={1.5} style={{ left: '0%' }} />
        <div
            className={`absolute z-30 ${badgeContainerColor} rounded-full flex items-center justify-center shadow-lg`}
            style={{ right: '-5%', bottom: '-5%', width: size * 0.55, height: size * 0.55 }}
        >
            <ShieldCheck size={size * 0.35} className={badgeIconColor} strokeWidth={2.5} />
        </div>
    </div>
);
