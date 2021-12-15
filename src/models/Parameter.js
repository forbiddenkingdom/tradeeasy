/**
 * Class that represents an Element Parameter.
 */
export default class Parameter {
  /**
   * Create Parameter.
   * @param {Object} props - Object defining Parameter Attributes & Values.
   * @param {Numer} props.id - Parameter unique identifier.
   * @param {String} props.name - Parameter name.
   * @param {String} props.type - Parameter type.
   * @param {String|Boolean|Number} props.defaultValue - Parameter default value.
   * @param {String|Boolean|Number} props.value - Parameter value (case of dropdown).
   * @param {String|Null} props.values - Parameter value (case of dropdown).
   * @param {Number} props.mqhOrder - Parameter order in MQH
   * @param {String} props.onlyExit - Parameter that displays in case element is exit.
   */
  constructor({
    id,
    name,
    type,
    defaultValue,
    value,
    values,
    parent,
    parentValue,
    mqhOrder,
    onlyExit,
    visible,
    box_visible,
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.value = value;
    this.values = values;
    this.parent = parent;
    this.parentValue = parentValue;
    this.mqhOrder = mqhOrder;
    this.onlyExit = onlyExit;
    this.visible = visible;
    this.box_visible = box_visible;
  }
}
