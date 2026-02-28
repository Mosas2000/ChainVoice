import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Create profile and post in one transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'create-profile-and-post',
                [types.ascii("testuser"), types.ascii("Test bio"),
                types.ascii("https://avatar.com/test.jpg"),
                types.utf8("Hello ChainVoice!")],
                user1.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);

        let profileCheck = chain.callReadOnlyFn('profiles', 'get-profile',
            [types.principal(user1.address)], user1.address);
        profileCheck.result.expectSome();

        let messageCheck = chain.callReadOnlyFn('messages', 'get-message-count',
            [], user1.address);
        assertEquals(messageCheck.result.expectUint(), 1);
    },
});

Clarinet.test({
    name: "Follow multiple users at once",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;
        const user3 = accounts.get('wallet_3')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user2"), types.ascii("Bio 2"), types.ascii("url2")],
                user2.address),
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user3"), types.ascii("Bio 3"), types.ascii("url3")],
                user3.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'follow-multiple-users',
                [types.list([types.principal(user2.address), types.principal(user3.address)])],
                user1.address)
        ]);

        block.receipts[0].result.expectOk();

        let followCheck = chain.callReadOnlyFn('profiles', 'is-following',
            [types.principal(user1.address), types.principal(user2.address)],
            user1.address);
        followCheck.result.expectSome().expectBool(true);
    },
});

Clarinet.test({
    name: "Post and react in one transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user2"), types.ascii("Bio"), types.ascii("url")],
                user2.address),
            Tx.contractCall('messages', 'post-public-message',
                [types.utf8("First message")], user2.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'post-and-react',
                [types.utf8("My reply"), types.uint(0), types.ascii("like")],
                user1.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);

        let messageCount = chain.callReadOnlyFn('messages', 'get-message-count',
            [], user1.address);
        assertEquals(messageCount.result.expectUint(), 2);
    },
});

Clarinet.test({
    name: "React to multiple messages",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user2"), types.ascii("Bio"), types.ascii("url")],
                user2.address),
            Tx.contractCall('messages', 'post-public-message',
                [types.utf8("Message 1")], user2.address),
            Tx.contractCall('messages', 'post-public-message',
                [types.utf8("Message 2")], user2.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'react-to-multiple',
                [types.list([types.uint(0), types.uint(1)]), types.ascii("love")],
                user1.address)
        ]);

        block.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Send multiple DMs",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;
        const user3 = accounts.get('wallet_3')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user1"), types.ascii("Bio"), types.ascii("url")],
                user1.address),
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user2"), types.ascii("Bio"), types.ascii("url")],
                user2.address),
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user3"), types.ascii("Bio"), types.ascii("url")],
                user3.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'send-multiple-dms',
                [types.list([types.principal(user2.address), types.principal(user3.address)]),
                types.list([types.utf8("Hello User 2!"), types.utf8("Hello User 3!")])],
                user1.address)
        ]);

        block.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Paused contract blocks operations",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let pauseBlock = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'set-paused',
                [types.bool(true)], deployer.address)
        ]);

        pauseBlock.receipts[0].result.expectOk();

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'create-profile-and-post',
                [types.ascii("test"), types.ascii("bio"),
                types.ascii("url"), types.utf8("message")],
                user1.address)
        ]);

        block.receipts[0].result.expectErr().expectUint(402);
    },
});

Clarinet.test({
    name: "Post thread creates multiple messages",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user1"), types.ascii("Bio"), types.ascii("url")],
                user1.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'post-thread',
                [types.list([types.utf8("Thread 1/3"),
                types.utf8("Thread 2/3"),
                types.utf8("Thread 3/3")])],
                user1.address)
        ]);

        block.receipts[0].result.expectOk();

        let messageCount = chain.callReadOnlyFn('messages', 'get-message-count',
            [], user1.address);
        assertEquals(messageCount.result.expectUint(), 3);
    },
});

Clarinet.test({
    name: "Follow and welcome sends DM",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;

        let setupBlock = chain.mineBlock([
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user1"), types.ascii("Bio"), types.ascii("url")],
                user1.address),
            Tx.contractCall('profiles', 'create-profile',
                [types.ascii("user2"), types.ascii("Bio"), types.ascii("url")],
                user2.address),
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('chainvoice-batch', 'follow-and-welcome',
                [types.principal(user2.address),
                types.utf8("Hey! Just followed you!")],
                user1.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);

        let followCheck = chain.callReadOnlyFn('profiles', 'is-following',
            [types.principal(user1.address), types.principal(user2.address)],
            user1.address);
        followCheck.result.expectSome().expectBool(true);
    },
});
