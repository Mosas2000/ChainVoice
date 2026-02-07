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
