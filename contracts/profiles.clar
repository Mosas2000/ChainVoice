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

(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-UNAUTHORIZED (err u403))
(define-constant ERR-INVALID-INPUT (err u400))

(define-public (create-profile (username (string-ascii 50)) (bio (string-ascii 500)) (avatar-url (string-ascii 200)))
  (let
    (
      (existing-profile (map-get? profiles { user: tx-sender }))
    )
    (asserts! (is-none existing-profile) ERR-ALREADY-EXISTS)
    (asserts! (> (len username) u0) ERR-INVALID-INPUT)
    
    (map-set profiles
      { user: tx-sender }
      {
        username: username,
        bio: bio,
        avatar-url: avatar-url,
        created-at: block-height,
        updated-at: block-height
      }
    )
    
    (map-set user-stats
      { user: tx-sender }
      {
        followers-count: u0,
        following-count: u0,
        posts-count: u0
      }
    )
    
    (var-set total-users (+ (var-get total-users) u1))
    (ok true)
  )
)

(define-public (update-profile (username (string-ascii 50)) (bio (string-ascii 500)) (avatar-url (string-ascii 200)))
  (let
    (
      (profile (unwrap! (map-get? profiles { user: tx-sender }) ERR-NOT-FOUND))
    )
    (asserts! (> (len username) u0) ERR-INVALID-INPUT)
    
    (map-set profiles
      { user: tx-sender }
      (merge profile {
        username: username,
        bio: bio,
        avatar-url: avatar-url,
        updated-at: block-height
      })
    )
    (ok true)
  )
)
