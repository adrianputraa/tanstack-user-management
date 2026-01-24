import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './provider/theme'

export default function Header() {
  return (
    <header className="sticky top-0 flex items-center justify-between bg-accent text-accent-foreground h-12 px-6">
      <h1 className="text-xl font-semibold">
        <Link to="/" viewTransition>
          <p>User managements</p>
        </Link>
      </h1>

      <ThemeToggle />
    </header>
  )
}
