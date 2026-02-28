# ChainVoice Contract API Reference

## Profiles Contract

### Public Functions

#### create-profile
Creates a new user profile.

Parameters:
- username: string-ascii (3-50 chars, must be unique)
- bio: string-ascii (max 500 chars)
- avatar-url: string-ascii (max 200 chars)

Returns: (response bool)

Errors:
- u409: Profile already exists
- u400: Invalid input (username too short or too long)
- u410: Username already taken by another user

#### update-profile
Updates existing profile.

Parameters:
- username: string-ascii (3-50 chars, must be unique if changed)
- bio: string-ascii (max 500 chars)
- avatar-url: string-ascii (max 200 chars)

Returns: (response bool)

Errors:
- u404: Profile not found
- u400: Invalid input
- u410: New username already taken by another user

#### follow-user
Follow another user.

Parameters:
- user-to-follow: principal

Returns: (response bool)

Errors:
- u404: Profile not found
- u409: Already following
- u400: Cannot follow self
- u411: Counter overflow (max 1,000,000)

#### unfollow-user
Unfollow a user. Uses safe-decrement to prevent uint underflow.

Parameters:
- user-to-unfollow: principal

Returns: (response bool)

Errors:
- u412: Not following user
- u404: User stats not found

### Read-Only Functions

#### get-profile
Get user profile data.

Parameters:
- user: principal

Returns: (optional profile-data)

#### get-user-stats
Get user statistics.

Parameters:
- user: principal

Returns: (optional stats-data)

#### is-following
Check if user A follows user B.

Parameters:
- follower: principal
- following: principal

Returns: bool

#### get-total-users
Get total registered users.

Returns: (response uint)

#### get-follow-info
Get follow relationship details.

Parameters:
- follower: principal
- following: principal

Returns: (optional follow-data)

#### get-principal-by-username
Look up which principal owns a given username.

Parameters:
- username: string-ascii (max 50 chars)

Returns: (optional { user: principal })

#### check-username-available
Check if a username is available for registration.

Parameters:
- username: string-ascii (max 50 chars)

Returns: (response bool) - true if available, false if taken

## Messages Contract

### Public Functions

#### post-public-message
Post a public message.

Parameters:
- content: string-utf8 (max 500 chars)

Returns: (response uint) - message ID

Errors:
- u400: Invalid content

#### send-direct-message
Send a private message.

Parameters:
- recipient: principal
- content: string-utf8 (max 500 chars)

Returns: (response uint) - message ID

Errors:
- u400: Invalid content or self-message

#### react-to-message
Add reaction to a message.

Parameters:
- message-id: uint
- reaction-type: string-ascii (max 20 chars)

Returns: (response bool)

Errors:
- u404: Message not found
- u400: Invalid reaction

#### remove-reaction
Remove your reaction from a message.

Parameters:
- message-id: uint

Returns: (response bool)

Errors:
- u404: Reaction not found

### Read-Only Functions

#### get-message
Get message by ID.

Parameters:
- message-id: uint

Returns: (optional message-data)

#### get-message-count
Get total message count.

Returns: (response uint)

#### get-author-message-count
Get total messages posted by a specific author.

Parameters:
- author: principal

Returns: (response uint)

#### get-author-message-at-index
Get full message data for an author's nth message (0-indexed).

Parameters:
- author: principal
- index: uint

Returns: (optional message-data)

#### get-messages-page
Get pagination metadata for a range of messages.

Parameters:
- start: uint (starting message ID)
- page-size: uint

Returns: (response { messages-start, page-size, total-count, has-more })

#### get-latest-messages-info
Get the ID range for the most recent N messages.

Parameters:
- page-size: uint

Returns: (response { start-id, end-id, total-count, page-size })

#### get-reaction
Get specific user's reaction to a message.

Parameters:
- message-id: uint
- user: principal

Returns: (optional reaction-data)

#### can-read-message
Check if user can read a message.

Parameters:
- message-id: uint
- reader: principal

Returns: (response bool)

## Error Codes

- u400: Invalid input (e.g., empty fields, username too short)
- u403: Unauthorized
- u404: Not found
- u409: Already exists (duplicate profile)
- u410: Username already taken by another user
- u411: Counter overflow (stats limit reached)
- u412: Not following (unfollow without follow relationship)
