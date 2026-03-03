import { useAuth } from '@/contexts/AuthContext';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { MessageFeed } from '@/components/messages/MessageFeed';
import { POLLING } from '@/config/polling';
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
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="space-y-4 md:space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Feed</h1>
            <p className="text-sm md:text-base text-muted-foreground">
          </p>
        </div>

        {/* Message Composer */}
        <MessageComposer />

        {/* Message Feed — polls every 30 s for new messages */}
        <MessageFeed limit={50} pollInterval={POLLING.feedInterval} />
      </div>
    </div>
  );
}
