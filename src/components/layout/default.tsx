import { ComponentPropsWithRef, useEffect, useState } from 'react'
import Header from './header'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from './sidebar'

interface Props extends ComponentPropsWithRef<'main'> {}

export default function DefaultLayout({
  children,
  className,
  ...props
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" className="shadow-none" />
      <SidebarInset>
        <Header isScrolled={isScrolled} />
        {isScrolled}
        <main className={cn(className)} {...props}>
          {children}
        </main>
        <aside></aside>
      </SidebarInset>
    </SidebarProvider>
  )
}
