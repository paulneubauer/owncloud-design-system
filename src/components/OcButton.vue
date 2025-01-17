<template>
  <component
    :is="type"
    v-bind="properties"
    :type="submit"
    :aria-label="ariaLabel"
    :class="$_ocButton_buttonClass"
    :disabled="disabled"
    v-on="handlers"
  >
    <!-- @slot Content of the button -->
    <slot />
  </component>
</template>

<script>
import { getSizeClass } from "../utils/sizeClasses"

export default {
  name: "OcButton",
  status: "review",
  release: "1.0.0",
  props: {
    /**
     * The html element used for the button.
     * `button, a, router`
     */
    type: {
      type: String,
      default: "button",
      validator: value => {
        return value.match(/(button|a|router-link)/)
      },
    },
    /**
     * Disable the button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * The size of the button. Defaults to medium.
     * `small, medium, large`
     */
    size: {
      type: String,
      default: "medium",
      validator: value => {
        return value.match(/(small|medium|large)/)
      },
    },
    /**
     * When setting the button’s type to a link, use this option to give a href.
     */
    href: {
      type: String,
      default: null,
    },
    /**
     * When setting the button’s type to a router-link, use this option to give a to.
     */
    to: {
      type: Object,
      default: null,
    },
    /**
     * The aria-label of the button.
     */
    ariaLabel: {
      type: String,
      default: null,
    },
    /**
     * Set the button’s type to “submit”.
     */
    submit: {
      type: String,
      default: null,
      validator: value => {
        return value.match(/(null|submit)/)
      },
    },
    /**
     * Style variation to give additional meaning.
     * Defaults to `primary`.
     * Can be `passive, primary, danger, success, warning`.
     */
    variation: {
      type: String,
      default: "passive",
      validator: value => {
        return value.match(/(passive|primary|success|danger|warning)/)
      },
    },
    /**
     * Style variation to give additional meaning.
     * Defaults to `outline`.
     * Can be `outline, filled, raw`.
     */
    appearance: {
      type: String,
      default: "outline",
      validator: value => {
        return value.match(/(filled|outline|raw)/)
      },
    },
    /**
     * Don't add the element class to this element.
     */
    stopClassPropagation: {
      type: Boolean,
      default: false,
    },
    /**
     * How to justify content within the button. Defaults to center.
     * `left, center, right, space-around, space-between, space-evenly`
     */
    justifyContent: {
      type: String,
      default: "center",
      validator: value => {
        return value.match(/(left|center|right|space-around|space-between|space-evenly)/)
      },
    },
    /**
     * Distance between children of the button. Defaults to medium. Might be overruled by justify-content value.
     * @values none, xsmall, small, medium, large, xlarge
     */
    gapSize: {
      type: String,
      default: "medium",
      validator: value => {
        return value.match(/(none|xsmall|small|medium|large|xlarge)/)
      },
    },
  },
  computed: {
    $_ocButton_buttonClass() {
      if (this.stopClassPropagation) return ""

      let classes = [
        "oc-button",
        `oc-button-${getSizeClass(this.size)}`,
        `oc-button-justify-content-${this.justifyContent}`,
        `oc-button-gap-${getSizeClass(this.gapSize)}`,
      ]

      classes.push(`oc-button-${this.variation}`)

      switch (this.appearance) {
        case "raw":
          classes.push(`oc-button-${this.variation}-raw`)
          break
        case "outline":
          classes.push(`oc-button-${this.variation}-outline`)
          break
      }

      return classes
    },

    properties: function () {
      const props = {}

      if (this.href) {
        props.href = this.href
      }

      if (this.to) {
        props.to = this.to
      }

      return props
    },

    handlers: function () {
      const handlers = {}

      if (this.type === "button") {
        handlers.click = this.$_ocButton_onClick
      }

      return handlers
    },
  },
  methods: {
    $_ocButton_onClick(event) {
      this.$emit("click", event)
    },
  },
}
</script>

<docs>
Buttons are generally used for interface actions. Suitable for all-purpose use.

Defaults to appearance that has white background with blue border.
Filled appearance should be used only once per view for main call-to-action.
All buttons are built with a css grid which ensures that there will be a pre-defined gutter between all child items.

## Accessibility
### Distinction when to use a `<button>`, when to use an `<a>`

Regardless of the visual representation the following differentiation should be made if in doubt what to choose.

- an anchor/link changes the location, be it internally on the website, or to another resource/document/route.
- a button does change the state of the website, e.g.: adds, deletes, opens, ...

### Accessible name
The accessible name ([explainer for the term](https://developer.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)) of a button is derived from several sources. Right now, only two of them are relevant:

1. The value of the `aria-label` attribute
2. The text between the opening and closing tag, `<button>This text here</button>`

When an aria-label attribute exists, its value will override the button text. So in this case, the accessible name would be "foo": `<button aria-label="foo">Bar</button>`, although visual users will see "Bar". This difference between accessible name and visual name is a problem for a certain type of assistive technology ([explainer for the term](https://en.wikipedia.org/wiki/Assistive_technology)), this is why the [WCAG success criterion 2.5.3, "Label in name"](https://www.w3.org/TR/WCAG21/#label-in-name) exists. This difference should be avoided, if it can't, W3C recommends that the accessible name should start with visible label.

### Icon-only button

Every button has to have an accessible name. It cannot be provided by a text between the button tags (for example, because it is an icon button; see "Upload" example below), the accessible name has to be provided by `aria-label`.

## Examples

```vue
<template>
<div>

  <h3 class="uk-heading-divider">
    Button variations
  </h3>
  <div class="uk-flex">
    <oc-button v-for="variation in variations" :variation="variation.title" class="oc-mr-s oc-mb-s">
      {{ variation.title }}
    </oc-button>
  </div>

  <h3 class="uk-heading-divider">
    Button sizes
  </h3>
  <div class="uk-flex">
    <oc-button size="large" class="oc-mr-s">Large</oc-button>
    <oc-button class="oc-mr-s oc-align-self-center">Medium (default)</oc-button>
    <oc-button size="small" class="oc-align-self-center">Small</oc-button>
  </div>

  <h3 class="uk-heading-divider">
    Button with icons
  </h3>
  <div class="uk-flex">
    <oc-button class="oc-mr-s">
      <oc-icon name="home" />
      Home
    </oc-button>
    <oc-button variation="primary" class="oc-mr-s">
      Select
      <oc-icon name="expand_more" />
    </oc-button>
    <oc-button variation="primary" aria-label="Upload a file">
      <oc-icon name="cloud_upload" />
    </oc-button>
  </div>

  <h3 class="uk-heading-divider">
    Using buttons in a group
  </h3>
  <div class="oc-button-group">
    <oc-button variation="primary" appearance="filled">Hello</oc-button>
    <oc-button>
      <oc-icon name="folder" />
      Demo Button
    </oc-button>
    <oc-button variation="danger" appearance="filled">Delete</oc-button>
  </div>

  <h3 class="uk-heading-divider">
    All available button combinations
  </h3>
  <oc-table-simple>
    <oc-thead>
      <oc-tr>
        <oc-th>Variation &amp; usage</oc-th>
        <oc-th>Outline (default)</oc-th>
        <oc-th>Filled</oc-th>
        <oc-th>Raw</oc-th>
      </oc-tr>
    </oc-thead>
    <oc-tbody>
      <oc-tr v-for="variation in variations">
      <oc-td>
        {{ variation.description }}
      </oc-td>
        <oc-td v-for="appearance in appearances">
          <oc-button :variation="variation.title" :appearance="appearance" class="oc-mb-s">
            {{ variation.title }}
          </oc-button>
          <oc-button :variation="variation.title" :appearance="appearance" disabled>
            {{ variation.title }}
          </oc-button>
        </oc-td>
      </oc-tr>
    </oc-tbody>
  </oc-table-simple>
  </div>
</template>
<script>
export default {
  computed: {
    variations() {
      return [
        {
          title: "passive",
          description: "Default appearance of interactive elements (links and buttons)"
        },
        {
          title: "primary",
          description: "Used as a visual clue to the main action on each page"
        },
        {
          title: "success",
          description: "Useful as confirmations or to finish a multi-step process"
        },
        {
          title: "warning",
          description: "Used as a visual hint for certain actions, like publicly sharing a file or removing a share"

        },
        {
          title: "danger",
          description: "Use for triggering possible destructive and non-reversible actions, like permanently deleting a file"
        }
      ]
    },
    appearances() {
      return [
        "outline",
        "filled",
        "raw"
      ]
    },
  },
}
</script>
```
</docs>
