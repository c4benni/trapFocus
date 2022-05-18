declare type PreventScroll = boolean | {
    forward?: boolean;
    backward?: boolean;
};
declare class ControlledFocus {
    $children: HTMLElement[];
    loop: boolean;
    preventScroll: PreventScroll;
    closest: string;
    focusableNodes: HTMLElement[] | null;
    index: number;
    constructor(arg: {
        root: HTMLElement;
        children?: string;
        loop?: boolean;
        preventScroll?: PreventScroll;
        closest?: string;
    });
    focus(index: number): Promise<HTMLElement | null>;
    forward(count?: number): Promise<HTMLElement | null>;
    backward(count?: number): Promise<HTMLElement | null>;
    destroy(): void;
}
declare type MoveFocus = (evt: KeyboardEvent) => boolean;
declare type Steps = number | {
    forward?: number;
    backward?: number;
};
export default class UiTrapFocus {
    isForward: MoveFocus;
    isBackward: MoveFocus;
    children: string;
    closest: string;
    loop: boolean;
    preventScroll: boolean;
    steps: Steps;
    constructor(arg?: {
        forward?: MoveFocus;
        backward?: MoveFocus;
        children?: string;
        closest?: string;
        loop?: boolean;
        preventScroll?: boolean;
        steps?: Steps;
    });
    private _name;
    controlledFocus(evt: KeyboardEvent): ControlledFocus;
    private get step();
    get sameInstance(): boolean;
    init(evt: KeyboardEvent): Promise<HTMLElement | null>;
    forward(evt: KeyboardEvent): Promise<HTMLElement | null>;
    backward(evt: KeyboardEvent): Promise<HTMLElement | null>;
}
export {};
