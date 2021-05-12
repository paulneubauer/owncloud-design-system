const tinyColor = require("tinycolor2")
const path = require("path")
const { color } = require("style-value-types")
const { contrast, generateContrastColors } = require("@adobe/leonardo-contrast-colors")
const getContrast = (color, on) =>
  Math.round(
    Math.abs(
      contrast(
        Object.values(tinyColor(color).toRgb()),
        Object.values(tinyColor(on).toRgb()),
        undefined
      )
    ) * 10
  ) / 10

exports.checkContrast = ({
  givenColor,
  givenBackgrounds = ["rgb(255, 255, 255)"],
  ratio = 3.5,
  colorspace = "CAM02",
  output = "RGB",
}) => {
  givenColor = tinyColor(givenColor)
  return {
    givenColor,
    results: [...(Array.isArray(givenBackgrounds) ? givenBackgrounds : [givenBackgrounds])].map(
      givenBackground => {
        givenBackground = tinyColor(givenBackground)
        const recommendedColor = tinyColor(
          generateContrastColors({
            colorKeys: [givenColor.toRgbString()],
            base: givenBackground.toRgbString(),
            ratios: [ratio],
            colorspace,
            output,
          })[0]
        )

        return {
          givenBackground,
          givenRatio: {
            value: getContrast(givenColor.toRgbString(), givenBackground.toRgbString()),
            get valid() {
              return this.value >= ratio
            },
          },
          recommendedColor,
          recommendedRatio: {
            value: getContrast(recommendedColor.toRgbString(), givenBackground.toRgbString()),
            get valid() {
              return this.value >= ratio
            },
          },
        }
      }
    ),
  }
}

exports.checkContrasts = ({
  givenColor,
  givenBackgrounds = ["rgb(255, 255, 255)"],
  ratio = 3.5,
  colorspace = "CAM02",
  output = "RGB",
}) => {
  givenColor = tinyColor(givenColor)
  givenBackgrounds = [
    ...(Array.isArray(givenBackgrounds) ? givenBackgrounds : [givenBackgrounds]),
  ].map(tinyColor)
  const recommendedColor = tinyColor(
    generateContrastColors({
      colorKeys: givenBackgrounds.map(givenBackground => givenBackground.toRgbString()),
      base: givenColor.toRgbString(),
      ratios: [ratio],
      colorspace,
      output,
    })[0]
  )

  return {
    givenColor,
    recommendedColor,

    backgrounds: givenBackgrounds.map(givenBackground => ({
      givenBackground,
      givenRatio: {
        value: getContrast(givenColor.toRgbString(), givenBackground.toRgbString()),
        get valid() {
          return this.value >= ratio
        },
      },
      recommendedRatio: {
        value: getContrast(recommendedColor.toRgbString(), givenBackground.toRgbString()),
        get valid() {
          return this.value >= ratio
        },
      },
    })),
  }
}

exports.getPropType = prop => {
  const { type } = prop.arguments | {}

  if (type) {
    return type
  } else if (color.test(prop.value)) {
    return "color"
  } else if (!isNaN(parseInt(prop.value)) || !isNaN(parseFloat(prop.value))) {
    return "number"
  }

  return "..."
}

exports.getPropCategory = prop => path.parse(prop.filePath).name

exports.sortProps = props => {
  return props.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1

    return 0
  })
}
