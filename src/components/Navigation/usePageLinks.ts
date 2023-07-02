// hooks/usePageLinks.js
import { useRouter } from 'next/router';
import {
    ClipboardIcon,
    CalendarIcon,
    BookOpenIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'

export const usePageLinks = () => {
    const router = useRouter();

    return [
        { name: 'My Tasks', href: '/dashboard/maintenance', icon: ClipboardIcon },
        { name: 'Quarterly Schedule', href: '/dashboard/schedule', icon: CalendarIcon },
        { name: 'Maintenance Library', href: '/dashboard/library', icon: BookOpenIcon},
        { name: 'Workcenters', href: '/dashboard/workcenter', icon: UserGroupIcon}
        
    ].map(link => ({
        ...link,
        current: router.pathname === link.href,
    }));
}
