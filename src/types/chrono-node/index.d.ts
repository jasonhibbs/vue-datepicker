// chrono-node type definitions
// Forked from https://github.com/Microsoft/BotBuilder

declare module chrono {
  export class en_GB {
    parseDate(text: string, refDate?: Date, opts?: any): Date
  }

  export class ParsedResult {
    start: ParsedComponents
    end: ParsedComponents
    index: number
    text: string
    ref: Date
  }

  export class ParsedComponents {
    assign(component: string, value: number): void
    imply(component: string, value: number): void
    get(component: string): number
    isCertain(component: string): boolean
    date(): Date
  }

  export function parseDate(text: string, refDate?: Date, opts?: any): Date
  export function parse(
    text: string,
    refDate?: Date,
    opts?: any
  ): ParsedResult[]
}

declare module 'chrono-node' {
  export = chrono
}
