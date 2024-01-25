import { DarkThemeToggle, Navbar as Nav } from 'flowbite-react'

export default function Navbar() {
  return (
    <Nav
      fluid
      className="h-full min-w-40 border-b border-gray-200 dark:border-gray-700"
    >
      <Nav.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Mobius
        </span>
      </Nav.Brand>
      <Nav.Toggle />
      <Nav.Collapse>
        <DarkThemeToggle />
      </Nav.Collapse>
    </Nav>
  )
}
