import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

const addEmployeeTrigger: Trigger = {
  type: TriggerTypes.Shortcut,
  name: "Add Employee Details",
  description:
    "Add an employee's leave days entitlement, manager and leave year details",
  workflow: "#/workflows/add_employee_details",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default addEmployeeTrigger;
