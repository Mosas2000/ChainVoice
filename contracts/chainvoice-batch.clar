(define-constant profiles-contract .profiles)
(define-constant messages-contract .messages)
(define-data-var owner principal tx-sender)
(define-data-var paused bool false)
(define-constant ERR-AUTH (err u401))
(define-constant ERR-PAUSED (err u402))
(define-constant ERR-INPUT (err u403))

(define-read-only (get-owner)
    (var-get owner))

(define-read-only (get-paused)
    (var-get paused))

(define-public (set-paused (p bool))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR-AUTH)
        (ok (var-set paused p))))

(define-public (transfer-ownership (new-owner principal))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR-AUTH)
        (ok (var-set owner new-owner))))

(define-public (create-profile-and-post 
    (username (string-ascii 50))
    (bio (string-ascii 500))
    (avatar-url (string-ascii 200))
    (message (string-utf8 500)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len username) u0) ERR-INPUT)
        (asserts! (> (len message) u0) ERR-INPUT)
        (try! (contract-call? profiles-contract create-profile username bio avatar-url))
        (try! (contract-call? messages-contract post-public-message message))
        (ok true)))

(define-public (follow-multiple-users (users (list 20 principal)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len users) u0) ERR-INPUT)
        (ok (map follow-user-internal users))))

(define-private (follow-user-internal (user principal))
    (contract-call? profiles-contract follow-user user))

(define-public (unfollow-multiple-users (users (list 20 principal)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len users) u0) ERR-INPUT)
        (ok (map unfollow-user-internal users))))

(define-private (unfollow-user-internal (user principal))
    (contract-call? profiles-contract unfollow-user user))

(define-public (post-and-react
    (message (string-utf8 500))
    (msg-id uint)
    (reaction (string-ascii 20)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len message) u0) ERR-INPUT)
        (asserts! (> (len reaction) u0) ERR-INPUT)
        (try! (contract-call? messages-contract post-public-message message))
        (try! (contract-call? messages-contract react-to-message msg-id reaction))
        (ok true)))

(define-public (react-to-multiple
    (msg-ids (list 10 uint))
    (reaction (string-ascii 20)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len msg-ids) u0) ERR-INPUT)
        (asserts! (> (len reaction) u0) ERR-INPUT)
        (ok (map react-internal 
            (map make-reaction msg-ids 
                (list reaction reaction reaction reaction reaction reaction reaction reaction reaction reaction))))))

(define-private (make-reaction (id uint) (r (string-ascii 20)))
    {id: id, r: r})

(define-private (react-internal (data {id: uint, r: (string-ascii 20)}))
    (contract-call? messages-contract react-to-message (get id data) (get r data)))

(define-public (send-multiple-dms
    (recipients (list 5 principal))
    (messages (list 5 (string-utf8 500))))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (is-eq (len recipients) (len messages)) ERR-INPUT)
        (asserts! (> (len recipients) u0) ERR-INPUT)
        (ok (map send-dm-internal (map make-dm recipients messages)))))

(define-private (make-dm (recipient principal) (msg (string-utf8 500)))
    {recipient: recipient, msg: msg})

(define-private (send-dm-internal (data {recipient: principal, msg: (string-utf8 500)}))
    (contract-call? messages-contract send-direct-message (get recipient data) (get msg data)))

(define-public (update-profile-and-announce
    (username (string-ascii 50))
    (bio (string-ascii 500))
    (avatar-url (string-ascii 200))
    (announcement (string-utf8 500)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (try! (contract-call? profiles-contract update-profile username bio avatar-url))
        (try! (contract-call? messages-contract post-public-message announcement))
        (ok true)))

(define-public (follow-and-welcome
    (user principal)
    (welcome-msg (string-utf8 500)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len welcome-msg) u0) ERR-INPUT)
        (try! (contract-call? profiles-contract follow-user user))
        (try! (contract-call? messages-contract send-direct-message user welcome-msg))
        (ok true)))

(define-public (post-thread (messages (list 10 (string-utf8 500))))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (asserts! (> (len messages) u0) ERR-INPUT)
        (ok (map post-message-internal messages))))

(define-private (post-message-internal (msg (string-utf8 500)))
    (contract-call? messages-contract post-public-message msg))

(define-public (cleanup-interactions
    (users (list 10 principal))
    (msg-ids (list 10 uint)))
    (begin
        (asserts! (not (var-get paused)) ERR-PAUSED)
        (map unfollow-user-internal users)
        (ok (map remove-reaction-internal msg-ids))))

(define-private (remove-reaction-internal (id uint))
    (contract-call? messages-contract remove-reaction id))
