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

(define-map username-to-principal
  { username: (string-ascii 50) }
  { user: principal }
)

(define-map follows
  { follower: principal, following: principal }
  { followed-at: uint }
)

(define-data-var total-users uint u0)

(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-UNAUTHORIZED (err u403))
(define-constant ERR-INVALID-INPUT (err u400))
(define-constant ERR-USERNAME-TAKEN (err u410))

(define-constant MIN-USERNAME-LENGTH u3)

(define-private (is-valid-username (username (string-ascii 50)))
  (and (>= (len username) MIN-USERNAME-LENGTH) (<= (len username) u50))
)

(define-private (is-username-available (username (string-ascii 50)))
  (is-none (map-get? username-to-principal { username: username }))
)

(define-public (create-profile (username (string-ascii 50)) (bio (string-ascii 500)) (avatar-url (string-ascii 200)))
  (let
    (
      (existing-profile (map-get? profiles { user: tx-sender }))
    )
    (asserts! (is-none existing-profile) ERR-ALREADY-EXISTS)
    (asserts! (is-valid-username username) ERR-INVALID-INPUT)
    (asserts! (is-username-available username) ERR-USERNAME-TAKEN)
    
    (map-set username-to-principal
      { username: username }
      { user: tx-sender }
    )
    
    (map-set profiles
      { user: tx-sender }
      {
        username: username,
        bio: bio,
        avatar-url: avatar-url,
        created-at: burn-block-height,
        updated-at: burn-block-height
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
      (old-username (get username profile))
    )
    (asserts! (is-valid-username username) ERR-INVALID-INPUT)
    
    ;; If the username is changing, validate the new one is available
    (if (not (is-eq old-username username))
      (begin
        (asserts! (is-username-available username) ERR-USERNAME-TAKEN)
        (map-delete username-to-principal { username: old-username })
        (map-set username-to-principal { username: username } { user: tx-sender })
      )
      true
    )
    
    (map-set profiles
      { user: tx-sender }
      (merge profile {
        username: username,
        bio: bio,
        avatar-url: avatar-url,
        updated-at: burn-block-height
      })
    )
    (ok true)
  )
)

(define-public (follow-user (user-to-follow principal))
  (let
    (
      (follower-profile (unwrap! (map-get? profiles { user: tx-sender }) ERR-NOT-FOUND))
      (following-profile (unwrap! (map-get? profiles { user: user-to-follow }) ERR-NOT-FOUND))
      (existing-follow (map-get? follows { follower: tx-sender, following: user-to-follow }))
      (follower-stats (unwrap! (map-get? user-stats { user: tx-sender }) ERR-NOT-FOUND))
      (following-stats (unwrap! (map-get? user-stats { user: user-to-follow }) ERR-NOT-FOUND))
    )
    (asserts! (not (is-eq tx-sender user-to-follow)) ERR-INVALID-INPUT)
    (asserts! (is-none existing-follow) ERR-ALREADY-EXISTS)
    
    (map-set follows
      { follower: tx-sender, following: user-to-follow }
      { followed-at: burn-block-height }
    )
    
    (map-set user-stats
      { user: tx-sender }
      (merge follower-stats { following-count: (+ (get following-count follower-stats) u1) })
    )
    
    (map-set user-stats
      { user: user-to-follow }
      (merge following-stats { followers-count: (+ (get followers-count following-stats) u1) })
    )
    
    (ok true)
  )
)

(define-public (unfollow-user (user-to-unfollow principal))
  (let
    (
      (existing-follow (unwrap! (map-get? follows { follower: tx-sender, following: user-to-unfollow }) ERR-NOT-FOUND))
      (follower-stats (unwrap! (map-get? user-stats { user: tx-sender }) ERR-NOT-FOUND))
      (following-stats (unwrap! (map-get? user-stats { user: user-to-unfollow }) ERR-NOT-FOUND))
    )
    (map-delete follows { follower: tx-sender, following: user-to-unfollow })
    
    (map-set user-stats
      { user: tx-sender }
      (merge follower-stats { following-count: (- (get following-count follower-stats) u1) })
    )
    
    (map-set user-stats
      { user: user-to-unfollow }
      (merge following-stats { followers-count: (- (get followers-count following-stats) u1) })
    )
    
    (ok true)
  )
)

(define-read-only (get-profile (user principal))
  (map-get? profiles { user: user })
)

(define-read-only (get-user-stats (user principal))
  (map-get? user-stats { user: user })
)

(define-read-only (is-following (follower principal) (following principal))
  (is-some (map-get? follows { follower: follower, following: following }))
)

(define-read-only (get-total-users)
  (ok (var-get total-users))
)

(define-read-only (get-follow-info (follower principal) (following principal))
  (map-get? follows { follower: follower, following: following })
)

(define-read-only (get-principal-by-username (username (string-ascii 50)))
  (map-get? username-to-principal { username: username })
)

(define-read-only (check-username-available (username (string-ascii 50)))
  (ok (is-username-available username))
)
