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
    )
    (asserts! (is-valid-content content) ERR-INVALID-INPUT)
    
    (map-set messages
      { message-id: message-id }
      {
        author: tx-sender,
        content: content,
        created-at: block-height,
        is-public: true,
        recipient: none
      }
    )
    
    (var-set message-counter (+ message-id u1))
    (ok message-id)
  )
)

(define-public (send-direct-message (recipient principal) (content (string-utf8 500)))
  (let
    (
      (message-id (var-get message-counter))
    )
    (asserts! (is-valid-content content) ERR-INVALID-INPUT)
    (asserts! (not (is-eq tx-sender recipient)) ERR-INVALID-INPUT)
    
    (map-set messages
      { message-id: message-id }
      {
        author: tx-sender,
        content: content,
        created-at: block-height,
        is-public: false,
        recipient: (some recipient)
      }
    )
    
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
      { reaction-type: reaction-type, reacted-at: block-height }
    )
    
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
