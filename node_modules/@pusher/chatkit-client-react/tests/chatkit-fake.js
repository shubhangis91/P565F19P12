class FakeAPI {
  constructor() {
    this.reset()
  }

  reset() {
    this.rooms = {}
    this.users = {}
    this.messages = {}
    this.cursors = {}
    this.nextMessageId = 0
    this.messageSubscriptions = {}
    this.currentUser = null
    this.typingEvents = []
  }

  createRoom({ id, userIds }) {
    for (let userId of userIds) {
      if (!this.users[userId]) {
        throw new Error(`user with id ${userId} not found in fake API`)
      }
    }
    this.rooms[id] = new Room({
      id,
      userIds,
      fakeAPI: this,
    })
  }

  getRoom({ id }) {
    return this.rooms[id]
  }

  getRoomsByUserId({ userId }) {
    return Object.values(this.rooms).filter(r => r.userIds.includes(userId))
  }

  createUser({ id }) {
    return (this.users[id] = new User({ id }))
  }

  getUser({ id }) {
    return this.users[id]
  }

  createMessage({ roomId, senderId, parts }) {
    if (!this.rooms[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }
    if (!this.messages[roomId]) {
      this.messages[roomId] = []
    }
    const message = new Message({
      roomId,
      senderId,
      id: this.nextMessageId++,
      parts,
    })
    this.messages[roomId].push(message)
    this.currentUser.onMessage(message)
    return message
  }

  getMessages({ roomId }) {
    if (!this.messages[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }
    return this.messages[roomId]
  }

  sendTypingEvent({ roomId, userId }) {
    if (!this.rooms[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }
    if (!this.rooms[roomId].users.map(u => u.id).includes(userId)) {
      throw new Error(
        `user with id ${userId} is not a member of room with id ${roomId}`,
      )
    }
    this.typingEvents.push({ roomId, userId })
    if (userId !== this.currentUser.id) {
      this.currentUser.onUserStartedTyping(roomId, this.users[userId])
    }
  }

  sendTypingStoppedEvent({ roomId, userId }) {
    if (!this.rooms[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }
    if (!this.rooms[roomId].users.map(u => u.id).includes(userId)) {
      throw new Error(
        `user with id ${userId} is not a member of room with id ${roomId}`,
      )
    }
    this.currentUser.onUserStoppedTyping(roomId, this.users[userId])
  }

  sendPresenceEvent({ userId, newState }) {
    if (!this.users[userId]) {
      throw new Error(`user with id ${userId} not found in fake API`)
    }
    const user = this.users[userId]
    const state = {
      previous: user.presence.state,
      current: newState,
    }
    user.presence.state = newState

    if (userId !== this.currentUser.id) {
      this.currentUser.onPresenceChanged(state, user)
    }
  }

  setCursor({ userId, roomId, position }) {
    if (!this.users[userId]) {
      throw new Error(`user with id ${userId} not found in fake API`)
    }
    if (!this.rooms[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }

    if (this.cursors[roomId] === undefined) {
      this.cursors[roomId] = {}
    }
    this.cursors[roomId][userId] = position
    if (this.currentUser) {
      const room = this.rooms[roomId]
      const user = this.users[userId]
      this.currentUser.onNewReadCursor({ user, room, position })
    }
  }

  getCursor({ userId, roomId }) {
    if (!this.users[userId]) {
      throw new Error(`user with id ${userId} not found in fake API`)
    }
    if (!this.rooms[roomId]) {
      throw new Error(`room with id ${roomId} not found in fake API`)
    }

    if (this.cursors[roomId] === undefined) {
      return undefined
    }
    return this.cursors[roomId][userId]
  }
}

export const fakeAPI = new FakeAPI()

export class Room {
  constructor({ id, userIds }) {
    this.id = id
    this.userIds = userIds
  }

  get users() {
    return this.userIds.map(id => fakeAPI.getUser({ id }))
  }

  get messages() {
    return fakeAPI.getMessages({ roomId: this.id })
  }
}

export class ChatManager {
  constructor({ instanceLocator, tokenProvider, userId }) {
    if (typeof instanceLocator !== "string") {
      throw new Error(
        `instance locator must be a string, got ${instanceLocator}`,
      )
    }
    const fetchToken = tokenProvider.fetchToken
    if (typeof fetchToken !== "function") {
      throw new Error(
        "tokenProvider does not implement the TokenProvider interface",
      )
    }
    if (typeof userId !== "string") {
      throw new Error(`userId must be a string, got ${userId}`)
    }

    this.instanceLocator = instanceLocator
    this.tokenProvider = tokenProvider
    this.userId = userId
    this.connected = false
  }

  connect() {
    return new Promise(resolve => {
      this.connected = true
      resolve(
        new CurrentUser({
          id: this.userId,
        }),
      )
    })
  }
}

export class CurrentUser {
  constructor({ id }) {
    fakeAPI.currentUser = this
    this.id = id
    this.hooks = {
      rooms: {},
    }
    this.serverInstanceV6 = {
      request: ({ method, path, json: { user_id: otherUserId } }) => {
        if (method !== "post" || path != "/one_to_one_rooms") {
          return Promise.reject("unsupported")
        }

        fakeAPI.createRoom({
          id: makeOneToOneRoomId(this.id, otherUserId),
          userIds: [this.id, otherUserId],
        })

        return Promise.resolve()
      },
    }
  }

  subscribeToRoomMultipart(options = {}) {
    const room = fakeAPI.getRoom({ id: options.roomId })
    if (!room) {
      return Promise.reject(new Error("couldn't get room from fake API"))
    }
    this.hooks.rooms[options.roomId] = options.hooks
    return Promise.resolve(room)
  }

  get rooms() {
    return fakeAPI.getRoomsByUserId({ userId: this.id })
  }

  sendSimpleMessage({ roomId, text }) {
    try {
      return Promise.resolve(
        fakeAPI.createMessage({
          roomId,
          senderId: this.id,
          parts: [
            {
              type: "text/plain",
              content: text,
            },
          ],
        }),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  sendMultipartMessage({ roomId, parts }) {
    try {
      return Promise.resolve(
        fakeAPI.createMessage({
          roomId,
          senderId: this.id,
          parts,
        }),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  setReadCursor({ roomId, position }) {
    try {
      return Promise.resolve(
        fakeAPI.setCursor({
          roomId,
          userId: this.id,
          position,
        }),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  isTypingIn({ roomId }) {
    try {
      return Promise.resolve(
        fakeAPI.sendTypingEvent({ roomId, userId: this.id }),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  onMessage(message) {
    if (
      this.hooks.rooms[message.roomId] &&
      this.hooks.rooms[message.roomId].onMessage
    ) {
      this.hooks.rooms[message.roomId].onMessage(message)
    }
  }

  onUserStartedTyping(roomId, user) {
    if (
      this.hooks.rooms[roomId] &&
      this.hooks.rooms[roomId].onUserStartedTyping
    ) {
      this.hooks.rooms[roomId].onUserStartedTyping(user)
    }
  }

  onUserStoppedTyping(roomId, user) {
    if (
      this.hooks.rooms[roomId] &&
      this.hooks.rooms[roomId].onUserStoppedTyping
    ) {
      this.hooks.rooms[roomId].onUserStoppedTyping(user)
    }
  }

  onPresenceChanged(state, user) {
    Object.entries(this.hooks.rooms).forEach(([roomId, hooks]) => {
      if (!hooks.onPresenceChanged) {
        return
      }
      const room = fakeAPI.getRoom({ id: roomId })
      if (!room.users.some(u => u.id === user.id)) {
        return
      }
      hooks.onPresenceChanged(state, user)
    })
  }

  onNewReadCursor(cursor) {
    const roomId = cursor.room.id
    if (this.hooks.rooms[roomId] && this.hooks.rooms[roomId].onNewReadCursor) {
      this.hooks.rooms[roomId].onNewReadCursor(cursor)
    }
  }

  readCursor({ roomId, userId }) {
    return fakeAPI.getCursor({ roomId, userId })
  }
}

export class User {
  constructor({ id }) {
    this.id = id
    this.presence = {
      state: "unknown",
    }
  }
}

export const makeOneToOneRoomId = (idA, idB) => {
  if (idB > idA) {
    const temp = idA
    idA = idB
    idB = temp
  }
  return `${btoa(idA)}-${btoa(idB)}`
}

export class Message {
  constructor({ roomId, senderId, id, parts }) {
    this.roomId = roomId
    this.senderId = senderId
    this.id = id
    this.parts = parts
  }
}
