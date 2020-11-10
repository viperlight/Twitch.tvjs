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
    on(event: 'ready', listener: () => void): this;
    on(event: 'connecting', listener: () => void): this;
    on(event: 'disconnected', listener: () => void): this;
    on(event: 'raw_message', listener: (message: message) => void): this;
    on(event: 'error', listener: (error: any) => void): this;
    on(event: 'raw', listener: (info: string) => void): this;
    on(event: 'warn', listener: (info: any) => void): this;
    on(event: 'chat', listener: (message: Message) => void): this;
    on(event: 'joinRoom', listener: (room: Channel) => void): this;
    on(event: 'leaveRoom', listener: (room: Channel) => void): this;
    on(event: 'viewerBan', listener: (viewer: Viewer) => void): this;
    on(event: 'viewerTimeout', listener: (viewer: Viewer) => void): this;
    on(event: 'cheer', listener: (message: Message) => void): this;

    once(event: string, listener: Function): this;
    once(event: 'ready', listener: () => void): this;
    once(event: 'connecting', listener: () => void): this;
    once(event: 'disconnected', listener: () => void): this;
    once(event: 'raw_message', listener: (message: message) => void): this;
    once(event: 'error', listener: (error: any) => void): this;
    once(event: 'raw', listener: (info: string) => void): this;
    once(event: 'warn', listener: (info: any) => void): this;
    once(event: 'chat', listener: (message: Message) => void): this;
    once(event: 'joinRoom', listener: (room: Channel) => void): this;
    once(event: 'leaveRoom', listener: (room: Channel) => void): this;
    once(event: 'viewerBan', listener: (viewer: Viewer) => void): this;
    once(event: 'viewerTimeout', listener: (viewer: Viewer) => void): this;
    once(event: 'cheer', listener: (message: Message) => void): this;
  }

  export class ClientUser {
    public username: string;
    public id: string;
  }

  export class Utils {
    public static unpack(data: string): message;
    public static properChannel(str: string): string;
    public static union(k: any, f: any): any[];
    public static wait(time: number): Promise<void>;
    public static Action(string: string): boolean;
    public static buildMessage(client: Client, content: string, channel: string): Message;
    public static splitLine(str: string, len: number): string[];
    public static properUsername(str: string): string;
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
    public handleMessage(event: string): void;
  }

  export class Viewer {
    public client: Client;
    public username: string;
    public id: string;
    public mod: boolean;
    public color?: string;
    public badges: string;
    public subscriber: boolean;
    public channel?: Channel;

    public ban(reason?: string): Promise<Viewer>
    public timeout(time?: number): Promise<Viewer>
  }

  export class Message {
    public client: Client;
    public author: Viewer;
    public channel: Channel;
    public content: string;
    public self: boolean;
  }

  export class Channel {
    public name: string;
    public id?: string;
    public client: Client;
    public moderators: Storage<string, Viewer>;
    public chatType?: ChatTypes;
    public subs?: boolean;
    public r9k?: boolean;
    public parseName: string;
    public send(content: string | { content: string }): Promise<Message>;
    public unban(username: string): Promise<void>;
    public leave(): void;
  }

  export interface message {
    raw: string,
    tags: Object,
    prefix: string,
    command: string,
    params: string[]
  }

  export type ChatTypes = 
  | 'any'
  | 'followers'
  | 'followerWait';

  export interface connectionOptions {
    username: string,
    password: string
  }

  export interface ClientOptions {
    channels: string[],
    reconnect: boolean,
  }

  export class Storage<K, V> extends Map<K, V> {
    public map(fs: Function): Array<any>;
    public find(fs: Function): any;
  }
}
