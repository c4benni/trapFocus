# UiTrapFocus

Keep focus locked in. Works for any web based project. Easy to use API.

## Getting started

```bash
npm i ui-trap-focus
```

## How it works

UiTrapFocus will attempt to trap focus on any focusable element by default in the root element listening for focus traps. You can listen for specific elements only to be trapped, or use the `closest` option to trap focus on specific elements e.g `<div tabindex='0'> <button /> </div>`. Normally, the `div` and the `button` will be focused if there's no specifc children, with the `closest` option, you can set where the focus should be trapped on. Check usage below.

## Usage

> a proper keyboard event only with e.target should be used to trap focus.

**_Vue project_**

<details open>
<summary>
<strong>
default behavior (use tab to move a step forward, shift + tab to move a step back)</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) => new TrapFocus().init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (use arrow down to move a step forward, arrow up to move a step back)</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    // customize what key controls the forward and backwards tabbing
    forward: (evt) => e.keyCode === 40,
    backward: (evt) => e.keyCode === 38,
  }).init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (trap focus moving forward only)
</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

// forward and backward option not neccessary
const trapFocus = (evt: KeyboardEvent) => new TrapFocus().forward(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (trap focus moving backward only)
</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

// forward and backward option not neccessary
const trapFocus = (evt: KeyboardEvent) => new TrapFocus().backward(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (trap specific children)
</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    // valid querySelector within the element listening for focus traps
    children: "button",
  }).init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (use closest match. Usefull when you want to trap specific children only)
</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    closest: "div",
  }).init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (disable loop)</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    loop: false,
  }).init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (prevent scroll)</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    // object syntax, if you need to be more specific
    // preventScroll: {
    //    forward: true,
    //    backward: false
    // }

    // boolean syntax
    preventScroll: true,
  }).init(evt);
</script>
```

</details>

<details>
<summary>
<strong>
custom behavior (move 2 steps forward, and 3 steps backward)</strong>
</summary>

```vue
<template>
  <div @keydown="trapFocus">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) =>
  new TrapFocus({
    // object, more robust syntax
    // steps: {
    //     forward: 2,
    //     backward: 3
    // }

    // number syntax
    steps: 3,
  }).init(evt);
</script>
```

</details>

Thats basically all the possible functionalities.

> Any other framework project e.g React, Svelte ... can easily integrate the above example. Vanilla web projects should listen for events with `addEventListener` or `onkeydown`.

Ciao.
