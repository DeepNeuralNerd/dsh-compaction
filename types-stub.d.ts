declare module '@deepseek-ai/cordis' {
  export class Context {
    constructor(...args: any[])
    logger: any
    on(event: string, handler: (...args: any[]) => any): any
    get(name: string): any
    [k: string]: any
  }
}
declare module '@deepseek-ai/schemastery' {
  type z<T = any> = any
  namespace z {
    function object(shape: any): any
    function boolean(): any
    function number(): any
    function string(): any
  }
  const z: z
  export default z
}
declare module '@deepseek-ai/dsh-compaction' {
  export class CompactionEngine {
    constructor(ctx: any)
    protected ctx: any
    [k: string]: any
  }
  export type CompactionResult = any
  export type CompactionTrigger = any
}
declare module '@deepseek-ai/dsh-session' {
  export type Session = any
}
