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

  if (report.backgrounds.every(background => background.givenRatio.valid)) {
    return
  }

  const printer = [chalk.red(util.format(`✗  %s`, chalk.bold(prop.name)))]
  report.backgrounds.forEach((background, i) => {
    const localPrinter = []
    printer.push("   ----------------------------------------------------------------------------")
    localPrinter.push(
      util.format(
        `   %s  %s has a contrast ratio of %s on %s`,
        chalk.bold(background.givenRatio.valid ? "✓" : "✗"),
        chalk.bold(
          chalk.hex(report.givenColor.toHexString())(`■ ${report.givenColor.toRgbString()}`)
        ),
        chalk.bold(background.givenRatio.value),
        chalk.bold(
          chalk.hex(background.givenBackground.toHexString())(
            `■ ${background.givenBackground.toRgbString()}`
          )
        )
      )
    )
    localPrinter.push(
      util.format(
        `      %s with a ratio of %s fixes this`,
        chalk.bold(
          chalk.hex(report.recommendedColor.toHexString())(
            `■ ${report.recommendedColor.toRgbString()}`
          )
        ),
        chalk.bold(background.recommendedRatio.value),
        chalk.bold(
          chalk.hex(background.givenBackground.toHexString())(
            `■ ${background.givenBackground.toRgbString()}`
          )
        )
      )
    )

    printer.push(chalk[background.givenRatio.valid ? "green" : "red"](localPrinter.join("\n")))
    if (i + 1 === report.backgrounds.length) {
      printer.push("\n")
    }
  })

  console.log(printer.join("\n"))
}
