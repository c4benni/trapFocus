# UiTrapFocus

Keep focus locked in. Works for any web based project. Easy to use API.

## Getting started

```bash
npm i ui-trap-focus
```

## How it works

UiTrapFocus will attempt to trap focus on any focusable element by default in the root element listening for focus traps. You can listen for specific elements only to be trapped, or use the `closest` option to trap focus on specific elements e.g `<div tabindex='0'> <button /> </div>`. Normally, the `div` and the `button` will be focused if there's no specifc children, with the `closest` option, you can set where the focus should be trapped on. Check usage below.

## Usage

**_Vue project_**

```vue
<template>
  <!--  a proper keyboard event only with e.target should be used to trap focus. -->

  <!-- default behavior (use tab to move a step forward, shift + tab to move a step back) -->
  <div @keydown="trapFocus">...</div>

  <!-- custom behavior (use arrow down to move a step forward, arrow up to move a step back) -->
  <div @keydown="trapFocusWithArrow">...</div>

  <!-- custom behavior (trap focus moving forward only) -->
  <div @keydown="trapFocusOnForward">...</div>

  <!-- custom behavior (trap focus moving backward only) -->
  <div @keydown="trapFocusOnBackward">...</div>

  <!-- custom behavior (trap specific children) -->
  <div @keydown="trapFocusForAllButtons">...</div>

  <!-- custom behavior (use closest match. Usefull when you want to trap specific children only) -->
  <div @keydown="trapFocusOnClosest">...</div>

  <!-- custom behavior (disable loop) -->
  <div @keydown="trapFocusWithoutLoop">...</div>

  <!-- custom behavior (prevent scroll) -->
  <div @keydown="trapFocusWithoutScrolling">...</div>

  <!-- custom behavior (move 2 steps forward, and 3 steps backward) -->
  <div @keydown="trapFocusWithSteps">...</div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import TrapFocus from "ui-trap-focus";

const trapFocus = (evt: KeyboardEvent) => new TrapFocus().init(evt);

const trapFocusWithArrow = (evt: KeyboardEvent) =>
  new TrapFocus({
    // customize what key controls the forward and backwards tabbing
    forward: (evt) => e.keyCode === 40,
    backward: (evt) => e.keyCode === 38,
  }).init(evt);

// forward and backward option not neccessary
const trapFocusOnForward = (evt: KeyboardEvent) => new TrapFocus().forward(evt);

// forward and backward option not neccessary
const trapFocusOnBackward = (evt: KeyboardEvent) =>
  new TrapFocus().backward(evt);

const trapFocusForAllButtons = (evt: KeyboardEvent) =>
  new TrapFocus({
    // valid querySelector within the element listening for focus traps
    children: "button",
  }).init(evt);

const trapFocusOnClosest = (evt: KeyboardEvent) =>
  new TrapFocus({
    closest: "div",
  }).init(evt);

const trapFocusWithoutLoop = (evt: KeyboardEvent) =>
  new TrapFocus({
    loop: false,
  }).init(evt);

const trapFocusWithoutScrolling = (evt: KeyboardEvent) =>
  new TrapFocus({
    // object syntax, if you need to be more specific
    // preventScroll: {
    //    forward: true,
    //    backward: false
    // }

    // boolean syntax
    preventScroll: true,
  }).init(evt);

const trapFocusWithSteps = (evt: KeyboardEvent) =>
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

Thats basically all the possible functionalities.

> Any other framework project e.g React, Svelte ... can easily integrate the above example. Vanilla web projects should listen for events with `addEventListener` or `onkeydown`.

Ciao.
