import { useAuth } from '@/contexts/AuthContext';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { MessageFeed } from '@/components/messages/MessageFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Feed() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Welcome to ChainVoice Feed</CardTitle>
            <CardDescription>
              Connect your wallet to view and post messages
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Join the conversation on the decentralized social network
            </p>
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Feed</h1>
          <p className="text-muted-foreground">
            Share your thoughts and see what others are saying
          </p>
        </div>

        {/* Message Composer */}
        <MessageComposer />

        {/* Message Feed */}
        <MessageFeed limit={50} />
      </div>
    </div>
  );
}
