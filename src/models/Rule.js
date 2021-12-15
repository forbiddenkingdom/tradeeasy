import Element from "./Element";

/**
 * Class representing a Rule
 */
export default class Rule {
  /**
   * @param {Object} options Options for the Rule
   * @param {Number} options.id Rule id
   * @param {Number} options.number Rule number
   * @param {String} options.type Rule type
   * @param {String} options.readingType
   * @param {Array.<Element>} options.elements
   * @param {Number} options.triggerCount
   * @param {Boolean} options.active
   * @param {Boolean} options.hasErrors
   */
  constructor({
    id,
    number,
    type,
    readingType,
    elements,
    triggerCount,
    active,
    hasErrors = true,
  }) {
    this.id = id;
    this.number = number;
    this.type = type;
    this.readingType = readingType;
    this.elements = elements;
    this.triggerCount = triggerCount;
    this.active = active;
    this.hasErrors = hasErrors;
  }
}
