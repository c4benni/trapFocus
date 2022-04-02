# UiTrapFocus

Keep focus locked in. Works for any web based project. Easy to use API.

## Getting started

```bash
npm i ui-trap-focus
```

## Usage

**_Vue project_**

```vue
<Template>
// a proper keyboard event only with e.target should be used to trap focus.
// dont forget to prevent default on keydown event!!!

// default behavior (use tab to move a step forward, shift + tab to move a step back)
<div
    @keydown.prevent
    @keyup="trapFocus"
>
    ...
</div>

// custom behavior (use arrow down to move a step forward, arrow up to move a step back)
<div
    @keydown.prevent
    @keyup="trapFocusWithArrow"
>
    ...
</div>

// custom behavior (move 2 steps forward, and 3 steps backward)
<div
    @keydown.prevent
    @keyup="trapFocusWithSteps"
>
    ...
</div>

// custom behavior (trap specific children)
<div
    @keydown.prevent
    @keyup="trapFocusForAllButtons"
>
    ...
</div>
</template>

// custom behavior (disable loop)
<div
    @keydown.prevent
    @keyup="trapFocusWithoutLoop"
>
    ...
</div>

// custom behavior (prevent scroll)
<div
    @keydown.prevent
    @keyup="trapFocusWithoutScrolling"
>
    ...
</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import TrapFocus from 'ui-trap-focus'

export default Vue.extends({
    ...
    data: () => ({
        trapFocus: new TrapFocus(),
        trapFocusWithArrow: new TrapFocus({
            // customize what key controls the forward and backwards tabbing
            forward: (evt) => e.keyCode === 40,
            backward: (evt) => e.keyCode === 38
        }),
        trapFocusWithSteps: new TrapFocus({
            steps: {
                forward: 2,
                backward: 3
            }
        }),
        trapFocusForAllButtons: new TrapFocus({
            // valid querySelector within the element listening for focus traps
            children: 'button'
        }),
        trapFocusWithoutLoop: new TrapFocus({
            loop: false
        }),
        trapFocusWithoutScrolling: new TrapFocus({
            // object syntax, if you need to be more specific
            // preventScroll: {
            //    forward: true,
            //    backward: false
            // }

            // boolean syntax
            preventScroll: true
        })
    })
})
</script>
```

Thats basically all the possible functionalities.

> Any other framework project e.g React, Svelte ... can easily integrate the above example. Vanilla web projects should listen for events with `addEventListener` or `onkeyup`. Don't forget to prevent default on `keydown` so the default behavior (TABBING, or scrolling) is skipped.

Ciao.
