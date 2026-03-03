import { useTransactions } from '@/contexts/TransactionContext';
import { useTransactionToasts } from '@/hooks/useTransactionToasts';
import { TransactionHistoryItem } from '@/components/transactions/TransactionHistoryItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, History } from 'lucide-react';

export function Transactions() {
  useTransactionToasts();

  const { transactions, clearAll, pendingCount } = useTransactions();

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0
              ? pendingCount + ' transaction' + (pendingCount > 1 ? 's' : '') + ' in progress'
              : 'Your on-chain activity'}
          </p>
        </div>

        {transactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <History className="h-10 w-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold">No transactions yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                When you create a profile, post a message, or follow someone,
                your transactions will appear here so you can track their
                progress on the blockchain.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionHistoryItem key={tx.txId} transaction={tx} />
          ))}
        </div>
      )}
    </main>
  );
}
