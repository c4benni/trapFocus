"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const isHTML = (arg) => arg instanceof HTMLElement;
class ControlledFocus {
    constructor(arg) {
        Object.defineProperty(this, "$children", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "loop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "preventScroll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "closest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "focusableNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
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
        closest, } = arg;
        if (isHTML(root)) {
            this.$children = [
                ...root.querySelectorAll(`${children || "*"}`),
            ];
            this.loop = loop;
            this.preventScroll = preventScroll;
            this.closest = closest || children;
            // get nodes that can be focused.
            // check if $children exist, then filter all to see if they're validHTML, and can be focused.
            this.focusableNodes = this.$children.length
                ? [...this.$children].filter((x) => {
                    const validFocusable = isHTML(x) &&
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
                        this.focusableNodes.indexOf(this.focusableNodes.find((x) => x.isSameNode(x.ownerDocument.activeElement)));
            }
        }
    }
    focus(index) {
        return new Promise((resolve) => {
            if (!this.focusableNodes || !this.focusableNodes.length) {
                return resolve(null);
            }
            const preventScroll = typeof this.preventScroll === "object"
                ? this.preventScroll.backward
                : this.preventScroll;
            const focusOn = this.focusableNodes[index];
            focusOn.focus({ preventScroll });
            this.destroy();
            resolve(focusOn);
        });
    }
    // move forward and destroy
    forward(count = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.focusableNodes || !this.focusableNodes.length) {
                return null;
            }
            const getIndex = this.index + 1 + count > this.focusableNodes.length - 1
                ? this.loop
                    ? 0
                    : this.focusableNodes.length - 1
                : this.index + 1 + count;
            return yield this.focus(getIndex);
        });
    }
    // move backward and destroy
    backward(count = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.focusableNodes || !this.focusableNodes.length) {
                return null;
            }
            const getIndex = this.index - 1 - count < 0
                ? this.loop
                    ? this.focusableNodes.length - 1
                    : 0
                : this.index - 1 - count;
            return yield this.focus(getIndex);
        });
    }
    // clear nodes to avoid memory leaks
    destroy() {
        this.$children = [];
        this.focusableNodes = null;
    }
}
function error() {
    console.error("UiTrapFocus not setup properly");
}
const name = "**UiTrapFocus**";
class UiTrapFocus {
    constructor(arg = {}) {
        Object.defineProperty(this, "isForward", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBackward", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "children", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "closest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "loop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "preventScroll", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "steps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: name
        });
        const isTab = (e) => (!e.ctrlKey && !e.metaKey && !e.altKey && /^tab$/i.test(e.code)) ||
            e.keyCode === 9;
        const { forward = (e) => isTab(e) && !e.shiftKey, backward = (e) => isTab(e) && e.shiftKey, children = "", closest = "", loop = false, preventScroll = false, steps = 0, } = arg;
        this.isForward = forward;
        this.isBackward = backward;
        this.children = children;
        this.loop = loop;
        this.closest = closest;
        this.preventScroll = preventScroll;
        this.steps = steps;
    }
    controlledFocus(evt) {
        if (!isHTML(evt.currentTarget)) {
            throw new Error("Invalid event object");
        }
        return new ControlledFocus({
            root: evt.currentTarget,
            children: this.children,
            closest: this.closest,
            loop: this.loop,
            preventScroll: this.preventScroll,
        });
    }
    get step() {
        return {
            forward: typeof this.steps === "object" ? this.steps.forward : this.steps,
            backward: typeof this.steps === "object" ? this.steps.backward : this.steps,
        };
    }
    get sameInstance() {
        return this._name === name;
    }
    init(evt) {
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
    forward(evt) {
        if (!this.sameInstance) {
            error();
            return Promise.resolve(null);
        }
        evt.preventDefault();
        const trapFocus = this.controlledFocus(evt);
        return trapFocus.forward(this.step.forward);
    }
    backward(evt) {
        if (!this.sameInstance) {
            error();
            return Promise.resolve(null);
        }
        evt.preventDefault();
        const trapFocus = this.controlledFocus(evt);
        return trapFocus.backward(this.step.backward);
    }
}
exports.default = UiTrapFocus;
//# sourceMappingURL=index.js.map