var CohortLogic = CohortLogic || {};

CohortLogic.Form_OnSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var isValid = true;
    var errorMessage = "";

    // Get values from schema attributes
    var startDate = formContext.getAttribute("cre84_startdate").getValue();
    var endDate = formContext.getAttribute("cre84_enddate").getValue();
    var maxCapacity = formContext.getAttribute("cre84_maximumcapacity").getValue();
    var status = formContext.getAttribute("cre84_status").getValue();
    var trainingCenter = formContext.getAttribute("cre84_trainingcenter")
        ? formContext.getAttribute("cre84_trainingcenter").getValue()
        : null;

    // 1. Validation: End Date must be after Start Date
    if (startDate && endDate) {
        if (endDate <= startDate) {
            isValid = false;
            errorMessage += "The End Date must be later than the Start Date.\n";
            formContext.getControl("cre84_enddate").setNotification("End Date must be after Start Date.", "date_error");
        } else {
            formContext.getControl("cre84_enddate").clearNotification("date_error");
        }
    }

    // 2. Validation: Maximum Capacity must be greater than 0
    if (maxCapacity !== null && maxCapacity <= 0) {
        isValid = false;
        errorMessage += "Maximum Capacity must be at least 1.\n";
        formContext.getControl("cre84_maximumcapacity").setNotification("Capacity must be positive.", "cap_error");
    } else {
        formContext.getControl("cre84_maximumcapacity").clearNotification("cap_error");
    }

    // 3. Validation: Active Cohorts require dates and Training Center
    // Status: Active = 2
    if (status === 2) {
        if (!startDate || !endDate) {
            isValid = false;
            errorMessage += "Start and End dates are required when setting the cohort to Active.\n";
        }

        if (!trainingCenter || trainingCenter.length === 0) {
            isValid = false;
            errorMessage += "Training Center is required when setting the cohort to Active.\n";
            if (formContext.getControl("cre84_trainingcenter")) {
                formContext.getControl("cre84_trainingcenter").setNotification("Training Center is required for Active cohorts.", "tc_error");
            }
        } else {
            if (formContext.getControl("cre84_trainingcenter")) {
                formContext.getControl("cre84_trainingcenter").clearNotification("tc_error");
            }
        }
    } else {
        if (formContext.getControl("cre84_trainingcenter")) {
            formContext.getControl("cre84_trainingcenter").clearNotification("tc_error");
        }
    }

    // Handle Save prevention
    if (!isValid) {
        formContext.ui.setFormNotification(errorMessage, "ERROR", "validation_summary");
        executionContext.getEventArgs().preventDefault();
    } else {
        formContext.ui.clearFormNotification("validation_summary");
    }
};