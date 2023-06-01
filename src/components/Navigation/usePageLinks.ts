// hooks/usePageLinks.js
import { useRouter } from 'next/router';
import {
    ClipboardIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'

export const usePageLinks = () => {
    const router = useRouter();

    return [
        { name: 'Maintenance', href: '/dashboard/maintenance', icon: ClipboardIcon },
        { name: 'Workcenters', href: '/dashboard/workcenter', icon: UsersIcon },
        { name: 'Testing', href: '/dashboard/testing', icon: UsersIcon}
        
    ].map(link => ({
        ...link,
        current: router.pathname === link.href,
    }));
}
