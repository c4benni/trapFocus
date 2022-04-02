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
    forward(count?: number): void;
    backward(count?: number): void;
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
    init(evt: KeyboardEvent): void;
    forward(evt: KeyboardEvent): void;
    backward(evt: KeyboardEvent): void;
}
export {};
