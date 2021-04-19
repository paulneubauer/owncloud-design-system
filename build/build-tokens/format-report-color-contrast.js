const { checkContrast, getPropType } = require("./utils")
const chalk = require("chalk")
const util = require("util")

module.exports = prop => {
  if (getPropType(prop) !== "color" || !prop.contrast) {
    return
  }

  const report = checkContrast({
    color: prop.value,
    base: prop.contrast?.base,
    ratio: prop.contrast?.ratio,
  })

  if (!report.suggestedColor) {
    return
  }

  console.log(
    chalk.red(
      util.format(
        `✗  %s:
      %s has a ratio of %s on %s.
      %s with a ratio of %s fixes this.
`,
        chalk.bold(prop.name),
        chalk.bold(
          chalk.hex(report.givenColor.toHexString())(`■ ${report.givenColor.toRgbString()}`)
        ),
        chalk.bold(report.givenRatio),
        chalk.bold(
          chalk.hex(report.givenBase.toHexString())(`■ ${report.givenBase.toRgbString()}`)
        ),
        chalk.bold(
          chalk.hex(report.suggestedColor.toHexString())(`■ ${report.suggestedColor.toRgbString()}`)
        ),
        chalk.bold(report.suggestedRatio)
      )
    )
  )
}
