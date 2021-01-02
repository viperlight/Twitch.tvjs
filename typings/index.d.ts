declare module 'twitch.tvjs' {
  import { EventEmitter } from 'events';

  export class Client extends EventEmitter {
    constructor(options: ClientOptions);

    public options: ClientOptions;
    public reconnect: boolean;
    public channels: Storage<string, Channel>;
    public viewers: Storage<string, Viewer>;
    private _channels: string[];
    public user?: ClientUser;
    public ws: ClientWebSocket;
    public ready: boolean;
    public currentLatency: number;
    public latency: Date;
    public readyAt?: number;

    public login(username: string, password: string): void;

    on(event: string, listener: Function): this;
    on(event: 'ready' | 'disconnected' | 'connecting', listener: () => void): this;
    on(event: 'raw_message', listener: (message: GatewayMessage) => void): this;
    on(event: 'error', listener: (error: any) => void): this;
    on(event: 'warn', listener: (info: any) => void): this;
    on(event: 'raw', listener: (info: string) => void): this;
    on(event: 'chat', listener: (message: Message) => void): this;
    on(event: 'leaveRoom' | 'joinRoom', listener: (room: Channel) => void): this;
    on(event: 'viewerBan' | 'viewerTimeout', listener: (viewer: Viewer) => void): this;
    on(event: 'cheer', listener: (message: Message) => void): this;
    on(event: 'hosting', listener: (room: Channel, count: string, hosted: string) => void): this;
    on(event: 'stopHosting', listener: (room: Channel, count: string) => void): this;
    on(event: 'whisper', listener: (message: Wisper) => void): this;
    on(event: 'message', listener: (message: Message) => void): this;

    once(event: string, listener: Function): this;
    once(event: 'ready' | 'disconnected' | 'connecting', listener: () => void): this;
    once(event: 'raw_message', listener: (message: GatewayMessage) => void): this;
    once(event: 'error', listener: (error: any) => void): this;
    once(event: 'warn', listener: (info: any) => void): this;
    once(event: 'raw', listener: (info: string) => void): this;
    once(event: 'chat', listener: (message: Message) => void): this;
    once(event: 'leaveRoom' | 'joinRoom', listener: (room: Channel) => void): this;
    once(event: 'viewerBan' | 'viewerTimeout', listener: (viewer: Viewer) => void): this;
    once(event: 'cheer', listener: (message: Message) => void): this;
    once(event: 'hosting', listener: (room: Channel, count: string, hosted: string) => void): this;
    once(event: 'stopHosting', listener: (room: Channel, count: string) => void): this;
    once(event: 'whisper', listener: (message: Wisper) => void): this;
    once(event: 'message', listener: (message: Message) => void): this;
  }

  export class ClientUser {
    constructor(data: GatewayMessage['tags']);

    public username: string;
    public id: string;
  }

  export class Utils {
    public static unpack(data: string): GatewayMessage;
    public static properChannel(str: string): string;
    public static union(k: any, f: any): any[];
    public static wait(time: number): Promise<void>;
    public static Action(string: string): boolean;
    public static buildMessage(client: Client, content: string, channel: string): Message;
    public static splitLine(str: string, len: number): string[];
    public static properUsername(str: string): string;
    public static badgesResolver(badgesString: string): Object;
  }

  export class ClientWebSocket extends EventEmitter {
    constructor(client: Client);

    public client?: Client;
    public socket?: WebSocket;
    public reason?: string;
    public reconnect: boolean;
    public pingTimeout?: NodeJS.Timeout;

    public connect(opt: connectionOptions): void;
    public handleOpening(opt: connectionOptions): void;
    public handleClose(opt: connectionOptions): void;
    public handleError(opt: connectionOptions): void;
    public handleMessage(event: MessageEvent<string>): void;
  }

  export class Viewer {
    constructor(client: Client, data: GatewayMessage['tags']);

    public client: Client;
    public username: string;
    public id: string;
    public mod: boolean;
    public color?: string;
    public badges?: Object;
    public subscriber: boolean;
    public channel?: Channel;

    public ban(reason?: string): Promise<Viewer>;
    public timeout(time?: number): Promise<Viewer>;
  }

  export class Message {
    constructor(client: Client, message: MessageDataStructures, self?: boolean);

    public client: Client;
    public author: Viewer;
    public channel?: Channel;
    public content: string;
    public self: boolean;
    public id?: string;

    public reply(content: string | { content: string }): Promise<Message>;
  }

  export class Wisper extends Message {
    constructor(client: Client, message: MessageDataStructures, whisperMessage: Object, self?: boolean);

    public author: Viewer | string;
    public user_id: string;
    public thread_id: string;
    public user_badges: Object;
  }

  export class Channel {
    constructor(client: Client, channel: string);

    public name: string;
    public id?: string;
    public client: Client;
    public moderators: Storage<string, Viewer>;
    public chatType?: ChatTypes;
    public subs?: boolean;
    public r9k?: boolean;

    public send(content: string | { content: string }): Promise<Message>;
    public unban(username: string): Promise<void>;
    public clear(): Promise<Channel>;
    public deleteMessages(messageID: string | string[]): Promise<void>;
    public leave(): void;
  }

  export interface GatewayMessage {
    raw: string;
    tags: Object;
    prefix: string;
    command: string;
    params: string[];
  }

  export interface MessageDataStructures {
    channel?: string;
    content: string;
    id?: string;
    author?: Viewer;
    ChatTypes: ChatTypes;
  }

  export type ChatTypes = 'any' | 'followers' | 'followerWait';

  export interface connectionOptions {
    username: string;
    password: string;
  }

  export interface ClientOptions {
    channels?: string[];
    reconnect?: boolean;
  }

  export class Storage<K, V> extends Map<K, V> {
    public map(fs: Function): Array<any>;
    public find(fs: Function): any;
  }
}
