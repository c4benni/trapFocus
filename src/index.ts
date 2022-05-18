const isHTML = (arg: any) => arg instanceof HTMLElement;

type PreventScroll =
  | boolean
  | {
      forward?: boolean;
      backward?: boolean;
    };

class ControlledFocus {
  $children: HTMLElement[] = [];
  loop: boolean = false;
  preventScroll: PreventScroll = false;
  closest: string = "";
  focusableNodes: HTMLElement[] | null = [];
  index: number = -1;

  constructor(arg: {
    root: HTMLElement;
    children?: string;
    loop?: boolean;
    preventScroll?: PreventScroll;
    closest?: string;
  }) {
    const {
      //   parent component; MUST BE HTMLElement.
      // the root will then look for all children with querySelector,
      // then filter nodes to get those that can be focused.
      root,
      //   children to tab through. MUST BE VALID CSS PROP.
      children = "*",
      // cycle the tabing. Useful in dialog
      loop = true,
      // prevent page from jumping to focused elements offsetTop
      preventScroll = false,
      // use closest option when targeting elements that arent deeply nested. Eg
      //   target only div, not button. markup: <div tabindex=0><button/></div>
      closest,
    } = arg;

    if (isHTML(root)) {
      this.$children = [
        ...(root.querySelectorAll(`${children || "*"}`) as unknown as []),
      ] as HTMLElement[];

      this.loop = loop;
      this.preventScroll = preventScroll;
      this.closest = closest || children;

      // get nodes that can be focused.
      // check if $children exist, then filter all to see if they're validHTML, and can be focused.

      this.focusableNodes = this.$children.length
        ? [...this.$children].filter((x) => {
            const validFocusable =
              isHTML(x) &&
              (parseInt(x.getAttribute("tabindex") || "-1") > -1 ||
                x.tabIndex > -1) &&
              !!!x.getAttribute("disabled");

            return validFocusable
              ? this.closest
                ? x.closest(this.closest)
                : x
              : false;
          })
        : null;

      // get the current index of the focused element in focusableNodes
      if (this.focusableNodes) {
        this.index =
          this.focusableNodes.length &&
          this.focusableNodes.indexOf(
            this.focusableNodes.find((x) =>
              x.isSameNode(x.ownerDocument.activeElement)
            ) as HTMLElement
          );
      }
    }
  }

  focus(index: number): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      if (!this.focusableNodes || !this.focusableNodes.length) {
        return resolve(null);
      }

      const preventScroll =
        typeof this.preventScroll === "object"
          ? this.preventScroll.backward
          : this.preventScroll;

      const focusOn = this.focusableNodes[index];

      focusOn.focus({ preventScroll });

      this.destroy();

      resolve(focusOn);
    });
  }

  // move forward and destroy
  async forward(count = 0): Promise<HTMLElement | null> {
    if (!this.focusableNodes || !this.focusableNodes.length) {
      return null;
    }

    const getIndex =
      this.index + 1 + count > this.focusableNodes.length - 1
        ? this.loop
          ? 0
          : this.focusableNodes.length - 1
        : this.index + 1 + count;

    return await this.focus(getIndex);
  }

  // move backward and destroy
  async backward(count = 0): Promise<HTMLElement | null> {
    if (!this.focusableNodes || !this.focusableNodes.length) {
      return null;
    }

    const getIndex =
      this.index - 1 - count < 0
        ? this.loop
          ? this.focusableNodes.length - 1
          : 0
        : this.index - 1 - count;

    return await this.focus(getIndex);
  }

  // clear nodes to avoid memory leaks
  destroy() {
    this.$children = [];
    this.focusableNodes = null;
  }
}

type MoveFocus = (evt: KeyboardEvent) => boolean;

type Steps =
  | number
  | {
      forward?: number;
      backward?: number;
    };

function error() {
  console.error("UiTrapFocus not setup properly");
}

const name = "**UiTrapFocus**";
export default class UiTrapFocus {
  isForward: MoveFocus;
  isBackward: MoveFocus;
  children: string;
  closest: string;
  loop: boolean;
  preventScroll: boolean;
  steps: Steps;

  constructor(
    arg: {
      forward?: MoveFocus;
      backward?: MoveFocus;
      children?: string;
      closest?: string;
      loop?: boolean;
      preventScroll?: boolean;
      steps?: Steps;
    } = {}
  ) {
    const isTab = (e: KeyboardEvent) =>
      (!e.ctrlKey && !e.metaKey && !e.altKey && /^tab$/i.test(e.code)) ||
      e.keyCode === 9;

    const {
      forward = (e) => isTab(e) && !e.shiftKey,
      backward = (e) => isTab(e) && e.shiftKey,
      children = "",
      closest = "",
      loop = false,
      preventScroll = false,
      steps = 0,
    } = arg;

    this.isForward = forward;
    this.isBackward = backward;
    this.children = children;
    this.loop = loop;
    this.closest = closest;
    this.preventScroll = preventScroll;
    this.steps = steps;
  }

  private _name = name;

  controlledFocus(evt: KeyboardEvent) {
    if (!isHTML(evt.currentTarget)) {
      throw new Error("Invalid event object");
    }

    return new ControlledFocus({
      root: evt.currentTarget as HTMLElement,
      children: this.children,
      closest: this.closest,
      loop: this.loop,
      preventScroll: this.preventScroll,
    });
  }

  private get step() {
    return {
      forward: typeof this.steps === "object" ? this.steps.forward : this.steps,
      backward:
        typeof this.steps === "object" ? this.steps.backward : this.steps,
    };
  }

  get sameInstance() {
    return this._name === name;
  }

  init(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      error();

      return Promise.resolve(null);
    }

    const trapFocus = this.controlledFocus(evt);

    if (this.isForward(evt)) {
      evt.preventDefault();
      return trapFocus.forward(this.step.forward);
    }

    if (this.isBackward(evt)) {
      evt.preventDefault();
      return trapFocus.backward(this.step.backward);
    }

    return Promise.resolve(null);
  }

  forward(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      error();

      return Promise.resolve(null);
    }

    evt.preventDefault();

    const trapFocus = this.controlledFocus(evt);

    return trapFocus.forward(this.step.forward);
  }

  backward(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      error();

      return Promise.resolve(null);
    }

    evt.preventDefault();

    const trapFocus = this.controlledFocus(evt);

    return trapFocus.backward(this.step.backward);
  }
}
