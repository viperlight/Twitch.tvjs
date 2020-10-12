declare module 'twitch.tvjs' {
  import { EventEmitter } from 'events';

  export class Client extends EventEmitter {
    constructor(options: ClientOptions);

    public options: ClientOptions;
    public reconnect: boolean;
    public channels: Storage<string, Channel>;
    public username?: string;
    public ws: ClientWebSocket;
    public ready: boolean;
    public currentLatency: number;
    public latency: Date;
    public readyAt?: number;
    public _time: number;
    private readonly _commands: CommandManager;

    public login(ops: connectionOptions): void;

    on(event: string, listener: Function): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'connecting', listener: () => void): this;
    on(event: 'disconnected', listener: () => void): this;
    on(event: 'raw_message', listener: (data: message) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'warn', listener: (warning: string) => void): this;
    on(event: 'raw', listener: (data: string) => void): this;
    on(event: 'chat', listener: (message: Message) => void): this;
    on(event: 'cheer', listener: (message: Message) => void): this;

    once(event: string, listener: Function): this;
    once(event: 'ready', listener: () => void): this;
    once(event: 'connecting', listener: () => void): this;
    once(event: 'disconnected', listener: () => void): this;
    once(event: 'raw_message', listener: (data: message) => void): this;
    once(event: 'error', listener: (error: Error) => void): this;
    once(event: 'warn', listener: (warning: string) => void): this;
    once(event: 'raw', listener: (data: string) => void): this;
    once(event: 'chat', listener: (message: Message) => void): this;
    once(event: 'cheer', listener: (message: Message) => void): this;
  }

  export class Utils {
    public static msg(data: string): message;
    public static properChannel(str: string): string;
    public static union(k: any, f: any): any[];
    public static wait(time: number): Promise<void>;
    public static Action(string: string): boolean;
    public static buildMessage(client: Client, content: string, channel: string): Promise<void>;
    public static splitLine(str: string, len: number): string[];
  }

  export class ClientWebSocket extends EventEmitter {
    constructor(client: Client);

    public client: Client;
    public socket?: WebSocket;
    public reason?: string;
    public pingTimeout?: setTimeout;

    public connect(opt: connectionOptions): void;
    public handleOpening(opt: connectionOptions): void;
    public handleClose(opt: connectionOptions): void;
    public handleError(opt: connectionOptions): void;
    public handleMessage(event: string): void;
  }

  export class Message {
    public content: string;
    public channel: Channel;
    public author: User;
    public self: boolean;
    public client: Client;
  }

  export class Channel {
    public name: string;
    public client: Client;
    public parseName: string;
    public send(content: string | { content: string }): Promise<void>;
  }

  export interface message {
    raw: string,
    tags: Object,
    prefix: string,
    command: string,
    params: string[]
  }

  export interface User {
    'badge-info': boolean,
    'display-name': string,
    'room-id': string,
    'tmi-sent-ts': string,
    'user-id': string,
    'user-type': boolean,
    badges: string,
    color: string,
    emotes: boolean,
    flags: boolean,
    id: string,
    mod: string | boolean,
    subscriber: string,
    turbo: string,
    username: string
  }

  export interface ClientOptions {
    channels: string[],
    reconnect: boolean,
  }

  export interface connectionOptions {
    username: string,
    password: string 
  }

  export interface ClientWebSocket {}

  export function setTimeout(callback: (...args: any[]) => 
    void, ms: number, ...args: any[]): NodeJS.Timeout

  export class Storage extends Map {
    public map(fs: Function): Array<any>;
    public find(fs: Function): any;
  }
}
