import { Link } from '@tanstack/react-router'
import { Button } from './Button'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
            <p className="font-display text-muted text-sm tracking-widest lowercase">error</p>
            <h1 className="font-display text-6xl font-bold text-primary">404</h1>
            <p className="font-sans text-muted text-sm tracking-wide">page not found</p>
            <Link to="/">
                <Button label="go home" />
            </Link>
        </div>
    )
}
