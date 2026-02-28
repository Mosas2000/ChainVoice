(define-map messages
  { message-id: uint }
  {
    author: principal,
    content: (string-utf8 500),
    created-at: uint,
    is-public: bool,
    recipient: (optional principal)
  }
)

(define-map message-reactions
  { message-id: uint, user: principal }
  { reaction-type: (string-ascii 20), reacted-at: uint }
)

(define-map author-message-count
  { author: principal }
  { count: uint }
)

(define-map author-message-index
  { author: principal, index: uint }
  { message-id: uint }
)

(define-data-var message-counter uint u0)

(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-UNAUTHORIZED (err u403))
(define-constant ERR-INVALID-INPUT (err u400))
(define-constant MAX-CONTENT-LENGTH u500)

(define-private (is-valid-content (content (string-utf8 500)))
  (and (> (len content) u0) (<= (len content) MAX-CONTENT-LENGTH))
)

(define-public (post-public-message (content (string-utf8 500)))
  (let
    (
      (message-id (var-get message-counter))
      (author-count (default-to { count: u0 } (map-get? author-message-count { author: tx-sender })))
      (current-author-count (get count author-count))
    )
    (asserts! (is-valid-content content) ERR-INVALID-INPUT)
    
    (map-set messages
      { message-id: message-id }
      {
        author: tx-sender,
        content: content,
        created-at: burn-block-height,
        is-public: true,
        recipient: none
      }
    )
    
    (map-set author-message-index
      { author: tx-sender, index: current-author-count }
      { message-id: message-id }
    )
    
    (map-set author-message-count
      { author: tx-sender }
      { count: (+ current-author-count u1) }
    )
    
    (print { event: "message-posted", message-id: message-id, author: tx-sender, is-public: true })
    
    (var-set message-counter (+ message-id u1))
    (ok message-id)
  )
)

(define-public (send-direct-message (recipient principal) (content (string-utf8 500)))
  (let
    (
      (message-id (var-get message-counter))
      (author-count (default-to { count: u0 } (map-get? author-message-count { author: tx-sender })))
      (current-author-count (get count author-count))
    )
    (asserts! (is-valid-content content) ERR-INVALID-INPUT)
    (asserts! (not (is-eq tx-sender recipient)) ERR-INVALID-INPUT)
    
    (map-set messages
      { message-id: message-id }
      {
        author: tx-sender,
        content: content,
        created-at: burn-block-height,
        is-public: false,
        recipient: (some recipient)
      }
    )
    
    (map-set author-message-index
      { author: tx-sender, index: current-author-count }
      { message-id: message-id }
    )
    
    (map-set author-message-count
      { author: tx-sender }
      { count: (+ current-author-count u1) }
    )
    
    (print { event: "dm-sent", message-id: message-id, author: tx-sender, recipient: recipient })
    
    (var-set message-counter (+ message-id u1))
    (ok message-id)
  )
)

(define-public (react-to-message (message-id uint) (reaction-type (string-ascii 20)))
  (let
    (
      (message (unwrap! (map-get? messages { message-id: message-id }) ERR-NOT-FOUND))
      (existing-reaction (map-get? message-reactions { message-id: message-id, user: tx-sender }))
    )
    (asserts! (> (len reaction-type) u0) ERR-INVALID-INPUT)
    (asserts! (<= (len reaction-type) u20) ERR-INVALID-INPUT)
    
    (map-set message-reactions
      { message-id: message-id, user: tx-sender }
      { reaction-type: reaction-type, reacted-at: burn-block-height }
    )
    
    (print { event: "reaction-added", message-id: message-id, user: tx-sender, reaction-type: reaction-type })
    
    (ok true)
  )
)

(define-public (remove-reaction (message-id uint))
  (let
    (
      (existing-reaction (unwrap! (map-get? message-reactions { message-id: message-id, user: tx-sender }) ERR-NOT-FOUND))
    )
    (map-delete message-reactions { message-id: message-id, user: tx-sender })
    (ok true)
  )
)

(define-read-only (get-message (message-id uint))
  (map-get? messages { message-id: message-id })
)

(define-read-only (get-message-count)
  (ok (var-get message-counter))
)

(define-read-only (get-author-message-count (author principal))
  (ok (default-to u0 (get count (map-get? author-message-count { author: author }))))
)

(define-read-only (get-author-message-at-index (author principal) (index uint))
  (match (map-get? author-message-index { author: author, index: index })
    entry (map-get? messages { message-id: (get message-id entry) })
    none
  )
)

(define-read-only (get-reaction (message-id uint) (user principal))
  (map-get? message-reactions { message-id: message-id, user: user })
)

(define-read-only (can-read-message (message-id uint) (reader principal))
  (match (map-get? messages { message-id: message-id })
    message
      (if (get is-public message)
        (ok true)
        (ok (or 
          (is-eq reader (get author message))
          (is-eq (some reader) (get recipient message))
        ))
      )
    (ok false)
  )
)

(define-read-only (get-messages-page (start uint) (page-size uint))
  (ok {
    messages-start: start,
    page-size: page-size,
    total-count: (var-get message-counter),
    has-more: (< (+ start page-size) (var-get message-counter))
  })
)

(define-read-only (get-latest-messages-info (page-size uint))
  (let
    (
      (total (var-get message-counter))
      (start (if (> total page-size) (- total page-size) u0))
    )
    (ok {
      start-id: start,
      end-id: total,
      total-count: total,
      page-size: (if (> total page-size) page-size total)
    })
  )
)
