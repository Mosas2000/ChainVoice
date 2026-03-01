import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-semibold">ChainVoice</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized social platform built on Stacks, secured by Bitcoin.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/feed" className="hover:text-foreground transition-colors">Feed</Link>
              <Link to="/profile" className="hover:text-foreground transition-colors">Profile</Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="https://github.com/Mosas2000/ChainVoice"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://docs.stacks.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Stacks Docs
              </a>
            </nav>
          </div>

          {/* Tech */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Built With</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Clarity Smart Contracts</span>
              <span>Stacks Blockchain</span>
              <span>React + TypeScript</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} ChainVoice. Built on Stacks &bull; Secured by Bitcoin.</p>
        </div>
      </div>
    </footer>
  );
}
