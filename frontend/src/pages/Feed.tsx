import { MessageComposer } from '@/components/messages/MessageComposer';
import { MessageFeed } from '@/components/messages/MessageFeed';
import { WalletConnectionGuard } from '@/components/layout/WalletConnectionGuard';

export function Feed() {
  return (
    <WalletConnectionGuard message="Connect your wallet to view and post messages">
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

        {/* Message Feed */}
        <MessageFeed limit={50} />
      </div>
    </div>
    </WalletConnectionGuard>
  );
}
