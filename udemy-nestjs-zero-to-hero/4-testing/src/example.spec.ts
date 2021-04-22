class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        console.log(`${name} is now a friend`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);

        if (idx === -1) {
            throw new Error('Friend not found');
        }

        this.friends.splice(idx, 1);
    }
}

// tests
describe('Friends', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

   it('initializes friends list', () => {
      expect(friendsList.friends.length).toEqual(0);
   });

    it('adds a friend to the list', () => {
        friendsList.addFriend('Amanda');

        expect(friendsList.friends.length).toEqual(1);
    });

    // podia estar dentro do add friend test
    it('announces friendship', () => {
        friendsList.announceFriendship = jest.fn();  // mock function;

        expect(friendsList.announceFriendship).not.toHaveBeenCalled();

        friendsList.addFriend('Amanda');

        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Amanda');
    });

    describe('removeFriend', () => {
        it('remove friend from the list', () => {
            friendsList.addFriend('Amanda');

            expect(friendsList.friends[0]).toEqual('Amanda');

            friendsList.removeFriend('Amanda');

            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist', () => {
            // expect(() => friendsList.removeFriend('Amanda')).toThrow(Error);
            expect(() => friendsList.removeFriend('Amanda')).toThrow(new Error('Friend not found'));
        });
    })
});