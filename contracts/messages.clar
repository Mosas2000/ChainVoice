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

(define-public (post-public-message (content (string-utf8 500)))
  (let
    (
      (message-id (var-get message-counter))
    )
    (asserts! (> (len content) u0) ERR-INVALID-INPUT)
    
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
