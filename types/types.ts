// types.ts
export interface Property {
    id: string;
    title: string;
    price: string;
    location: string;
    img: string;
}

export type TabType = "home" | "search" | "chat" | "account";

export interface NavigationItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onPress: () => void;
}
