// hooks/usePageLinks.js
import { useRouter } from 'next/router';
import {
    CalendarIcon,
    ClipboardIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'

export const usePageLinks = () => {
    const router = useRouter();

    return [
        { name: 'Maintenance', href: '/dashboard/maintenance', icon: ClipboardIcon },
        { name: 'Workcenters', href: '/dashboard/workcenter', icon: UsersIcon },
        { name: 'Projects', href: '#', icon: FolderIcon },
        { name: 'Calendar', href: '#', icon: CalendarIcon },
        { name: 'Documents', href: '#', icon: DocumentDuplicateIcon },
        { name: 'Reports', href: '#', icon: ChartPieIcon },
    ].map(link => ({
        ...link,
        current: router.pathname === link.href,
    }));
}
