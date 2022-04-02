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

  // move forward and destroy
  forward(count = 0) {
    if (!this.focusableNodes || !this.focusableNodes.length) {
      return;
    }

    const preventScroll =
      typeof this.preventScroll === "object"
        ? this.preventScroll.forward
        : this.preventScroll;

    const getIndex =
      this.index + 1 + count > this.focusableNodes.length - 1
        ? this.loop
          ? 0
          : this.focusableNodes.length - 1
        : this.index + 1 + count;

    this.focusableNodes[getIndex].focus({ preventScroll });

    this.destroy();
  }

  // move backward and destroy
  backward(count = 0) {
    if (!this.focusableNodes || !this.focusableNodes.length) {
      return;
    }

    const preventScroll =
      typeof this.preventScroll === "object"
        ? this.preventScroll.backward
        : this.preventScroll;

    const getIndex =
      this.index - 1 - count < 0
        ? this.loop
          ? this.focusableNodes.length - 1
          : 0
        : this.index - 1 - count;

    this.focusableNodes[getIndex].focus({ preventScroll });

    this.destroy();
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
  throw new Error("UiTrapFocus not setup properly");
}

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

  private _name = "**UiTrapFocus";

  controlledFocus(evt: KeyboardEvent) {
    if (isHTML(evt.currentTarget)) {
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
    return this._name === "**UiTrapFocus";
  }

  init(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      return error();
    }

    const trapFocus = this.controlledFocus(evt);

    if (this.isForward(evt)) {
      evt.preventDefault();
      return trapFocus.forward(this.step.forward);
    }

    if (this.isBackward(evt)) {
      evt.preventDefault();
      trapFocus.backward(this.step.backward);
    }
  }

  forward(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      return error();
    }

    evt.preventDefault();

    const trapFocus = this.controlledFocus(evt);

    trapFocus.forward(this.step.forward);
  }

  backward(evt: KeyboardEvent) {
    if (!this.sameInstance) {
      return error();
    }

    evt.preventDefault();

    const trapFocus = this.controlledFocus(evt);

    trapFocus.backward(this.step.backward);
  }
}
