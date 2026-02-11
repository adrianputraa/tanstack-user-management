import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { ComponentPropsWithRef } from 'react'
import { ThemeToggle } from '../provider/theme'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

interface Props extends ComponentPropsWithRef<'header'> {
  isScrolled: boolean
}

export default function Header(props: Props) {
  return (
    <header
      className={cn(
        'sticky top-0 flex items-center text-accent-foreground h-12 px-6',
        {
          'bg-sidebar': props.isScrolled,
        }
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-xl font-semibold mr-auto">
        <Link to="/" viewTransition>
          <p>User managements</p>
        </Link>
      </h1>

      <ThemeToggle />
    </header>
  )
}
