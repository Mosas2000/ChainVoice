(define-map profiles
  { user: principal }
  {
    username: (string-ascii 50),
    bio: (string-ascii 500),
    avatar-url: (string-ascii 200),
    created-at: uint,
    updated-at: uint
  }
)

(define-map user-stats
  { user: principal }
  {
    followers-count: uint,
    following-count: uint,
    posts-count: uint
  }
)

(define-data-var total-users uint u0)
