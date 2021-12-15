import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import OpenRule from "models/OpenRule";
import CloseRule from "models/CloseRule";
import Element from "models/Element";
import Parameter from "models/Parameter";

/**
 * Search the SHOOT_SIGNAL parameter and see if i'ts in trigger mode.
 * @param {Element} element
 */
function isTrigger(element) {
  const parameter = element.params.find(
    (parameter) => parameter.name == "SHOOT_SIGNAL"
  );
  // If the element hasn't the SHOOT_SIGNAL param or I'ts in trigger mode, return true.
  if (!parameter || parameter.value == 1) return true;
  return false;
}

const initialState = {
  openRuleCount: 0,
  closeRuleCount: 0,
  elementCount: 0,
  rules: [],
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    resetBuilder: () => {
      return { ...initialState };
    },
    loadRules: (state, action) => {
      const newState = { ...initialState, rules: [] };
      const OPEN_RULES = action.payload.openRules;
      const CLOSE_RULES = action.payload.closeRules;
      OPEN_RULES.map((rule) => {
        const newRule = new OpenRule({ ...rule });
        newRule.elements = [];
        rule.elements.map((element) => {
          const newElement = new Element({ ...element });
          newElement.params = [];
          element.params.map((parameter) => {
            newElement.params.push(new Parameter({ ...parameter }));
          });
          newRule.elements.push(newElement);
          // Check if the element is in trigger mode & if true, +1 to rule trigger counter.
          if (newRule.triggerCount == 0) {
            if (isTrigger(newElement)) {
              newRule.triggerCount += 1;
            }
          }
        });
        newState.rules.push(newRule);
        // If more than 1 trigger & elements inside rule, scenario has errors.
        if (newRule.triggerCount != 1 && newRule.elements.length > 0) {
          newRule.hasErrors = true;
        }
        newState.openRuleCount += 1;
      });
      CLOSE_RULES.map((rule) => {
        const newRule = new CloseRule({ ...rule });
        newRule.elements = [];
        rule.elements.map((element) => {
          const newElement = new Element({ ...element });
          newElement.params = [];
          element.params.map((parameter) => {
            newElement.params.push(new Parameter({ ...parameter }));
          });
          newRule.elements.push(newElement);
          // Check if the element is in trigger mode & if true, +1 to rule trigger counter.
          if (newRule.triggerCount == 0)
            if (isTrigger(newElement)) {
              newRule.triggerCount += 1;
            }
        });
        newState.rules.push(newRule);
        // If more than 1 trigger & elements inside rule, scenario has errors.
        if (newRule.triggerCount != 1 && newRule.elements.length > 0) {
          newRule.hasErrors = true;
        }
        newState.closeRuleCount += 1;
      });
      return newState;
    },
    addOpenRule: (state, action) => {
      state.rules.push(
        new OpenRule({
          id: new Date().getTime(),
          number: state.openRuleCount,
          openBuys: action.payload.buys,
          openSells: action.payload.sells,
        })
      );
      state.openRuleCount += 1;
    },
    addCloseRule: (state, action) => {
      state.rules.push(
        new CloseRule({
          id: new Date().getTime(),
          number: state.closeRuleCount,
          closeBuys: action.payload.buys,
          closeSells: action.payload.sells,
        })
      );
      state.closeRuleCount += 1;
    },
    addElement: (state, action) => {
      const { ruleId, element, parameters } = action.payload;
      const newState = cloneDeep(state);
      const ruleIndex = newState.rules.findIndex((rule) => rule.id == ruleId);
      const newParameters = parameters.map((parameter) => {
        return new Parameter({
          id: parameter.id,
          name: parameter.reference,
          type: parameter.type,
          defaultValue: parameter.default,
          value: parameter.default,
          values: parameter.dropdown_value,
          parent: parameter.parent,
          parentValue: parameter.parent_value,
          mqhOrder: parameter.mqh_order,
          onlyExit: parameter.OnlyExit,
          visible: parameter.visible,
          box_visible: parameter.box_visible,
        });
      });
      const newElement = new Element({
        id: element.element_id,
        number: state.elementCount,
        name: element.element_name,
        image: process.env.PUBLIC_URL + element.image_url,
        params: newParameters,
      });

      newState.rules[ruleIndex].elements.push(newElement);

      // Check if the element is in trigger mode & if true, +1 to rule trigger counter.
      if (isTrigger(newElement)) newState.rules[ruleIndex].triggerCount += 1;
      // If more than 1 trigger & elements inside rule, scenario has errors.
      if (
        newState.rules[ruleIndex].triggerCount != 1 &&
        newState.rules[ruleIndex].elements.length > 0
      ) {
        newState.rules[ruleIndex].hasErrors = true;
      } else {
        newState.rules[ruleIndex].hasErrors = false;
      }

      newState.elementCount += 1;
      return newState;
    },
    modifyElementShootType: (state, action) => {
      const { ruleId, shootTypeValue } = action.payload;
      const newState = cloneDeep(state); // Duplicate actual state
      const modifiedRuleIndex = newState.rules.findIndex(
        (rule) => rule.id == ruleId
      ); //  Search the modified rule index by id.
      // If the shootTYPE is 1, add trigger, else remove 1
      shootTypeValue == 1
        ? (newState.rules[modifiedRuleIndex].triggerCount += 1)
        : (newState.rules[modifiedRuleIndex].triggerCount -= 1);
      // If more than 1 trigger & elements inside rule, scenario has errors.
      if (
        newState.rules[modifiedRuleIndex].triggerCount != 1 &&
        newState.rules[modifiedRuleIndex].elements.length > 0
      ) {
        newState.rules[modifiedRuleIndex].hasErrors = true;
      } else {
        newState.rules[modifiedRuleIndex].hasErrors = false;
      }
      return newState;
    },
    deleteRule: (state, action) => {
      const ruleIndex = state.rules.findIndex(
        (rule) => rule.id == action.payload
      );
      if (state.rules[ruleIndex].type == "open") {
        state.openRuleCount -= 1;
      } else {
        state.closeRuleCount -= 1;
      }
      state.rules.splice(ruleIndex, 1);
    },
    deleteElement: (state, action) => {
      const { ruleId, elementNumber } = action.payload;
      const newState = cloneDeep(state);
      const ruleIndex = newState.rules.findIndex((rule) => rule.id == ruleId);
      const elementIndex = newState.rules[ruleIndex].elements.findIndex(
        (element) => element.number == elementNumber
      );

      // Check if the element is in trigger mode & if true, -1 to rule trigger counter.
      if (isTrigger(newState.rules[ruleIndex].elements[elementIndex]))
        newState.rules[ruleIndex].triggerCount -= 1;
      // If more than 1 trigger & elements inside rule, scenario has errors.
      if (
        newState.rules[ruleIndex].triggerCount != 1 &&
        newState.rules[ruleIndex].elements.length > 0
      ) {
        newState.rules[ruleIndex].hasErrors = true;
      } else {
        newState.rules[ruleIndex].hasErrors = false;
      }
      newState.rules[ruleIndex].elements.splice(elementIndex, 1);
      newState.elementCount -= 1;
      return newState;
    },
    configureOpenRule: (state, action) => {
      const {
        ruleId,
        sameType,
        differentType,
        volumeType,
        volume,
        porcentage,
        readingType,
      } = action.payload;
      const rulePosition = state.rules.findIndex((rule) => rule.id == ruleId);
      state.rules[rulePosition].allowSameType = sameType;
      state.rules[rulePosition].allowDifferentType = differentType;
      state.rules[rulePosition].openVolType = volumeType;
      state.rules[rulePosition].volume = volume;
      state.rules[rulePosition].porcentage = porcentage;
      state.rules[rulePosition].readingType = readingType;
    },
    configureCloseRule: (state, action) => {
      const { readingType, ruleId } = action.payload;
      const rulePosition = state.rules.findIndex((rule) => rule.id == ruleId);
      state.rules[rulePosition].readingType = readingType;
    },
    activateRule: (state, action) => {
      const { ruleId, isActive } = action.payload;
      const newState = cloneDeep(state);
      const rulePosition = state.rules.findIndex((rule) => rule.id == ruleId);
      newState.rules[rulePosition].active = isActive;
      return newState;
    },
  },
});

export const {
  addCloseRule,
  addElement,
  addOpenRule,
  deleteElement,
  deleteRule,
  configureOpenRule,
  configureCloseRule,
  modifyElementShootType,
  loadRules,
  resetBuilder,
  activateRule,
} = builderSlice.actions;
export default builderSlice.reducer;
