import { cn } from '@/lib/utils'
import React from 'react'

interface ListProps extends React.ComponentPropsWithRef<'ul'> {
  children: React.ReactNode
}

export function List({ className, children, ...props }: ListProps) {
  return (
    <ul className={cn('list-decimal list-inside', className)} {...props}>
      {children}
    </ul>
  )
}

interface ListItemProps extends React.ComponentPropsWithRef<'li'> {
  children: React.ReactNode
}

export function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </li>
  )
}
