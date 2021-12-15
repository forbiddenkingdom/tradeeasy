import Rule from "./Rule";
/**
 * Class representating a CloseRule
 */
export default class CloseRule extends Rule {
  /**
     * Create a CloseRule
     * @param {Object} options - Object defining CloseRule Attributes & Values.
     * @param {Number} options.id - Rule unique identificator.
     * @param {Boolean} options.closeBuys - Tell the rule if it can close purchases.
     * @param {Boolean} options.closeSells - Tell the rule if it can close sales.
     * @param {Number} options.closingVolume - Tell the rule the colsing volume.
     * @param {String} options.readingType - Rule reading type Can be Candle or Tick.
     * @param {Array.<Element>} options.elements - Rule Elements.
     * @param {Number} options.triggerCount Used to count how many trigger has the rule (min/max 1)

     */
  constructor({
    id,
    number,
    hasErrors = true,
    closeBuys = "1",
    closeSells = "1",
    closingVolume = 100,
    readingType = "1",
    elements = [],
    triggerCount = 0,
    active = true,
  }) {
    super({
      id,
      number,
      type: "close",
      readingType,
      elements,
      triggerCount,
      hasErrors,
      active,
    });
    this.hasErrors = hasErrors;
    this.closeBuys = closeBuys;
    this.closeSells = closeSells;
    this.closingType = "0";
    this.closingVolume = closingVolume;
  }
}
