# ChainVoice Batch Contract

Optimized contract for executing multiple on-chain actions in single transactions.

## Functions

### 1. create-profile-and-post
Create profile + post first message atomically
- **Params**: username, bio, avatar-url, message
- **Saves**: ~500 STX vs 2 separate transactions

### 2. follow-multiple-users
Follow up to 20 users in one transaction
- **Params**: list of user addresses
- **Saves**: ~15-25% vs individual follows

### 3. unfollow-multiple-users
Unfollow up to 20 users in one transaction
- **Params**: list of user addresses

### 4. post-and-react
Post new message + react to existing message
- **Params**: message, message-id, reaction-type
- **Saves**: ~300 STX vs 2 transactions

### 5. react-to-multiple
React to up to 10 messages with same reaction
- **Params**: list of message-ids, reaction-type
- **Saves**: ~20% per additional reaction

### 6. send-multiple-dms
Send up to 5 direct messages
- **Params**: list of recipients, list of messages

### 7. update-profile-and-announce
Update profile + post announcement
- **Params**: username, bio, avatar-url, announcement

### 8. follow-and-welcome
Follow user + send welcome DM
- **Params**: user-address, welcome-message

### 9. post-thread
Post up to 10 messages as thread
- **Params**: list of messages
- **Saves**: ~25% vs individual posts

### 10. cleanup-interactions
Unfollow users + remove reactions
- **Params**: list of users, list of message-ids

## Benefits

- **15-25% fee reduction** on batch operations
- **Atomic execution** - all or nothing
- **Better UX** - fewer wallet confirmations
- **Optimized code** - minimal deployment cost

## Error Codes

- `401` - Not authorized
- `402` - Contract paused
- `403` - Invalid input

## Admin Functions

- `set-paused` - Emergency pause (owner only)
- `transfer-ownership` - Transfer contract ownership
