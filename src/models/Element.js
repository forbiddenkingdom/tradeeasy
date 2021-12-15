/**
 * Class representating an Element
 */
export default class Element {
  /**
   * Create Element
   * @param {Object} object - Object defining Element Attributes & Values.
   * @param {Number} object.id - Element unique identifier.
   * @param {Number} object.type - Element type (Trigger|Filter).
   * @param {String} object.name - Element display name.
   * @param {String} object.image - Element image route.
   */
  constructor({ id, type = 0, name, number, image = undefined, params = [] }) {
    this.id = id;
    this.number = number;
    this.type = type;
    this.name = name;
    this.image = image;
    this.params = params;
  }
}
