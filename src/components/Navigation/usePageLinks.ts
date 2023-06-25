// hooks/usePageLinks.js
import { useRouter } from 'next/router';
import {
    ClipboardIcon,
    UsersIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline'

export const usePageLinks = () => {
    const router = useRouter();

    return [
        { name: 'My Tasks', href: '/dashboard/maintenance', icon: ClipboardIcon },
        { name: 'Quarterly Schedule', href: '/dashboard/schedule', icon: CalendarIcon },
        { name: 'Maintenance Library', href: '/dashboard/library', icon: UsersIcon}
        
    ].map(link => ({
        ...link,
        current: router.pathname === link.href,
    }));
}
