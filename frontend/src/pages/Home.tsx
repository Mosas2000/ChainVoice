import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Shield, Wallet, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageSquare className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold">ChainVoice</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A decentralized social platform built on Stacks blockchain.
          Own your voice, control your data, connect with authenticity.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/feed">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <a
            href="https://github.com/yourusername/chainvoice"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">
              View on GitHub
            </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Decentralized</CardTitle>
            <CardDescription>
              Built on Stacks blockchain for censorship-resistant communication
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Wallet className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Self-Custody</CardTitle>
            <CardDescription>
              Your keys, your data. Connect with any Stacks-compatible wallet
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Social Features</CardTitle>
            <CardDescription>
              Post messages, follow users, react to content, send DMs
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Fast & Secure</CardTitle>
            <CardDescription>
              Powered by Bitcoin's security with fast, predictable transactions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2">Step 1</Badge>
              <CardTitle>Connect Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use Leather, Xverse, or any Stacks wallet to connect to ChainVoice.
                No email or personal information required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2">Step 2</Badge>
              <CardTitle>Create Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose a unique username and customize your profile with a display name,
                bio, and avatar. Your profile is stored on-chain.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2">Step 3</Badge>
              <CardTitle>Start Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Post public messages, send direct messages, follow other users,
                and react to content. All interactions are secured by the blockchain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Ready to Own Your Voice?</h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Join the decentralized social revolution. Connect your wallet and
                start sharing your thoughts on ChainVoice today.
              </p>
              <Link to="/feed">
                <Button size="lg" variant="secondary" className="mt-4">
                  Launch App
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          Built on Stacks • Secured by Bitcoin • Powered by Clarity Smart Contracts
        </p>
      </div>
    </div>
  );
}
