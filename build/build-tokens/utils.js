const tinyColor = require("tinycolor2")
const path = require("path")
const { color } = require("style-value-types")
const { contrast, generateContrastColors } = require("@adobe/leonardo-contrast-colors")

exports.checkContrast = ({
  color,
  base = "rgb(255, 255, 255)",
  ratio = 1,
  colorspace = "CAM02",
  output = "RGB",
}) => {
  const report = {
    givenColor: tinyColor(color),
    givenBase: tinyColor(base),
    get givenRatio() {
      return (
        Math.round(
          Math.abs(
            contrast(
              Object.values(this.givenColor.toRgb()),
              Object.values(this.givenBase.toRgb()),
              undefined
            )
          ) * 10
        ) / 10
      )
    },
  }

  if (ratio > report.givenRatio) {
    report.suggestedColor = tinyColor(
      generateContrastColors({
        colorKeys: [report.givenColor.toRgbString()],
        base: report.givenBase.toRgbString(),
        ratios: [ratio],
        colorspace,
        output,
      })[0]
    )
    report.suggestedRatio =
      Math.round(
        Math.abs(
          contrast(
            Object.values(report.suggestedColor.toRgb()),
            Object.values(report.givenBase.toRgb()),
            undefined
          )
        ) * 10
      ) / 10
  }

  return report
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
