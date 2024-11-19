import type { User } from "./User";
import { OutgoingMessage } from "./types";
//this aim-> control and have detail of room created

export class RoomManager {
    //public rooms:User[],
    // rooms:string[]
    rooms: Map<string, User[]> = new Map();//key->room value->users
    //instace here help in maintaining one list of room and user
    //eg Person A creates a new room Room1 and adds User1:
    // Shared Room List: { Room1: [User1] }
    // Person B also wants to add User2 to Room1. Since they use the same RoomManager, the shared list is updated:
    // Shared Room List: { Room1: [User1, User2] } rather than room1:user1 and room1 user2

    static instance: RoomManager;
    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public removeUser(user: User, spaceId: string) {
        if (!this.rooms.has(spaceId)) {
            return;
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? []));
    }

    public addUser(spaceId: string, user: User) {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }
        console.log("add-user")
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
    }

    public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        if (!this.rooms.has(roomId)) {
            // console.log("roomid not found")
            return;
        }
        //triggering socket.emit from user
        // console.log(roomId)
        // console.log("closed")
        this.rooms.get(roomId)?.forEach((u) => {
            if (u.id !== user.id) {
                u.send(message);
            }
        });
    }
}