# ChainVoice Contract API Reference

## Profiles Contract

### Public Functions

#### create-profile
Creates a new user profile.

Parameters:
- username: string-ascii (max 50 chars)
- bio: string-ascii (max 500 chars)
- avatar-url: string-ascii (max 200 chars)

Returns: (response bool)

Errors:
- u409: Profile already exists
- u400: Invalid input

#### update-profile
Updates existing profile.

Parameters:
- username: string-ascii (max 50 chars)
- bio: string-ascii (max 500 chars)
- avatar-url: string-ascii (max 200 chars)

Returns: (response bool)

Errors:
- u404: Profile not found
- u400: Invalid input

#### follow-user
Follow another user.

Parameters:
- user-to-follow: principal

Returns: (response bool)

Errors:
- u404: Profile not found
- u409: Already following
- u400: Cannot follow self

#### unfollow-user
Unfollow a user.

Parameters:
- user-to-unfollow: principal

Returns: (response bool)

Errors:
- u404: Not following user

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

- u400: Invalid input
- u403: Unauthorized
- u404: Not found
- u409: Already exists
- u410: Inactive/disabled
