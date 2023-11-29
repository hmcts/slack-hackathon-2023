import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AddEmployeeDetailsFunction } from "../functions/send_time_off_request_to_manager/definition.ts";

/**
 * A Workflow composed of two steps: asking for time off details from the user
 * that started the workflow, and then forwarding the details along with two
 * buttons (approve and deny) to the user's manager.
 */
export const AddEmployeeWorkflow = DefineWorkflow({
  callback_id: "add_employee_details",
  title: "Add Employee Details",
  description: "",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});

// Step 1: opening a form for the user to input their time off details.
const formData = AddEmployeeWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Add Employee Details",
    interactivity: AddEmployeeWorkflow.inputs.interactivity,
    submit_label: "Submit",
    description:
      "Add an employee's leave days entitlement, manager and leave year details",
    fields: {
      required: [
        "manager",
        "leave_cycle_start_date",
        "leave_cycle_end_date",
        "leave_entitlement_days",
      ],
      elements: [
        {
          name: "manager",
          title: "Manager",
          type: Schema.slack.types.user_id,
        },
        {
          name: "leave_cycle_start_date",
          title: "Leave Cycle Start Date",
          type: "slack#/types/date",
        },
        {
          name: "leave_cycle_end_date",
          title: "Leave Cycle End Date",
          type: "slack#/types/date",
        },
        {
          name: "leave_entitlement_days",
          title: "Leave Entitlement Days",
          type: Schema.types.integer,
        },
      ],
    },
  },
);

// Step 2: send time off request details along with approve/deny buttons to manager
AddEmployeeWorkflow.addStep(AddEmployeeDetailsFunction, {
  interactivity: formData.outputs.interactivity,
  employee: AddEmployeeWorkflow.inputs.interactivity.interactor.id,
  manager: formData.outputs.fields.manager,
  leave_cycle_start_date: formData.outputs.fields.leave_cycle_start_date,
  leave_cycle_end_date: formData.outputs.fields.leave_cycle_end_date,
  leave_entitlement_days: formData.outputs.fields.leave_entitlement_days,
});
