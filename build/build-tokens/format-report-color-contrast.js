const { checkContrast, getPropType } = require("./utils")
const chalk = require("chalk")
const util = require("util")

module.exports = prop => {
  if (getPropType(prop) !== "color" || !prop.check?.contrast) {
    return
  }

  const report = checkContrast({
    givenColor: prop.value,
    givenBackgrounds: prop.check?.contrast?.background,
    ratio: prop.check?.contrast?.ratio,
  })

  if (report.results.every(result => result.givenRatio.valid)) {
    return
  }

  const printer = [chalk.red(util.format(`✗  %s`, chalk.bold(prop.name)))]
  report.results.forEach((result, i) => {
    printer.push("   ----------------------------------------------------------------------------")
    printer.push(
      chalk[result.givenRatio.valid ? "green" : "red"](
        [
          util.format(
            `   %s  %s has a contrast ratio of %s on %s`,
            chalk.bold(result.givenRatio.valid ? "✓" : "✗"),
            chalk.bold(
              chalk.hex(report.givenColor.toHexString())(`■ ${report.givenColor.toRgbString()}`)
            ),
            chalk.bold(result.givenRatio.value),
            chalk.bold(
              chalk.hex(result.givenBackground.toHexString())(
                `■ ${result.givenBackground.toRgbString()}`
              )
            )
          ),
          util.format(
            `      %s with a ratio of %s fixes this`,
            chalk.bold(
              chalk.hex(result.recommendedColor.toHexString())(
                `■ ${result.recommendedColor.toRgbString()}`
              )
            ),
            chalk.bold(result.recommendedRatio.value),
            chalk.bold(
              chalk.hex(result.givenBackground.toHexString())(
                `■ ${result.givenBackground.toRgbString()}`
              )
            )
          ),
        ].join("\n")
      )
    )
    if (i + 1 === report.results.length) {
      printer.push("\n")
    }
  })

  console.log(printer.join("\n"))
}
