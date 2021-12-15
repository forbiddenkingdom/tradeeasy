import Rule from "./Rule";

/**
 * Class representating OpenRule
 */
export default class OpenRule extends Rule {
  /**
   * Create an OpenRule
   * @param {Object} options - Object defining OpenRule Attributes & Values.
   * @param {Number} options.id - Rule unique identificator.
   * @param {Boolean} options.openBuys - Tell the rule if it can open purchases.
   * @param {Boolean} options.openSells - Tell the rule if it can open sales.
   * @param {Number} options.allowSameType - Rule allowSameType.
   * @param {Number} options.allowDifferentType - Rule allowDifferentType.
   * @param {Object} options.volume - Rule volume.
   * @param {String} options.volume.type - Rule volume type.
   * @param {Number} options.volume.value - Rule volume value.
   * @param {String} options.readingType - Rule Rule reading type Can be Candle or Tick.
   * @param {Array.<Object>} options.elements - Rule Elements array.
   * @param {Number} options.triggerCount Used to count how many trigger has the rule (min/max 1)
   */
  constructor({
    id,
    number,
    hasErrors = true,
    openBuys = "1",
    openSells = "1",
    allowSameType = "0",
    allowDifferentType = "1",
    openVolType = "0",
    porcentage = "1",
    volume = "1",
    readingType = "1",
    triggerCount = 0,
    elements = [],
    active = true,
  }) {
    super({
      id,
      number,
      type: "open",
      readingType,
      elements,
      triggerCount,
      hasErrors,
      active,
    });
    this.hasErrors = hasErrors;
    this.openBuys = openBuys;
    this.openSells = openSells;
    this.allowSameType = allowSameType;
    this.allowDifferentType = allowDifferentType;
    this.openVolType = openVolType;
    this.porcentage = porcentage;
    this.volume = volume;
  }
}
