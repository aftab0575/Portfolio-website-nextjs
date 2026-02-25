'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { logoutUser } from '@/store/slices/authSlice'
import { routes } from '@/constants/routes'
import {
  LayoutDashboard,
  FolderKanban,
  Code,
  Briefcase,
  Mail,
  Palette,
  LogOut,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: routes.admin.dashboard, icon: LayoutDashboard },
  { name: 'Site', href: routes.admin.site, icon: ImageIcon },
  { name: 'Projects', href: routes.admin.projects, icon: FolderKanban },
  { name: 'Skills', href: routes.admin.skills, icon: Code },
  { name: 'Experience', href: routes.admin.experience, icon: Briefcase },
  { name: 'Messages', href: routes.admin.messages, icon: Mail },
  { name: 'Themes', href: routes.admin.themes, icon: Palette },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push(routes.admin.login)
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

