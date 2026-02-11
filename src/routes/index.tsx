import DefaultLayout from '@/components/layout/default'
import { List, ListItem } from '@/components/list'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <DefaultLayout>
      <div className="container min-h-screen">
        <div className="mx-auto">
          <p>Available Pages</p>
          <List>
            <ListItem>
              <Link to="/register">Register</Link>
            </ListItem>
          </List>
        </div>
      </div>
    </DefaultLayout>
  )
}
