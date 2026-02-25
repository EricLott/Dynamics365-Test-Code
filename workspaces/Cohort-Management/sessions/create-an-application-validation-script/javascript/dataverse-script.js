if (typeof (VEEP) === "undefined") { VEEP = {}; }
if (typeof (VEEP.Application) === "undefined") { VEEP.Application = {}; }

/**
 * Application Validation Logic
 * @param {ExecutionContext} executionContext 
 */
VEEP.Application.onSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var isValid = true;
    var errorMessages = [];

    // 1. Validate Contact Lookup
    var contact = formContext.getAttribute("veep_contact").getValue();
    if (!contact) {
        isValid = false;
        errorMessages.push("An Application must be associated with a Contact.");
    }

    // 2. Validate Years of Service (Non-negative)
    var yearsOfService = formContext.getAttribute("veep_yearsofservice").getValue();
    if (yearsOfService !== null && yearsOfService < 0) {
        isValid = false;
        errorMessages.push("Years of Service cannot be a negative value.");
    }

    // 3. Conditional Validation: Verified Separation Date
    var isVerifiedSeparation = formContext.getAttribute("veep_verifieddateofseparation").getValue();
    var separationDate = formContext.getAttribute("veep_dateofseparation").getValue();
    if (isVerifiedSeparation === true && separationDate === null) {
        isValid = false;
        errorMessages.push("Date of Separation is required when 'Verified Date of Separation' is checked.");
    }

    // 4. Status-Based Validation: Ready for Placement (305540003)
    var statusCode = formContext.getAttribute("statuscode").getValue();
    if (statusCode === 305540003) {
        var hasDiploma = formContext.getAttribute("veep_diplomaorged").getValue();
        if (hasDiploma !== true) {
            isValid = false;
            errorMessages.push("Applicant must have a Diploma or GED to be marked 'Ready for Placement'.");
        }
    }

    // 5. Status-Based Validation: Accepted (305540009)
    if (statusCode === 305540009) {
        var relocationChoice = formContext.getAttribute("veep_acceptedrelocationchoice").getValue();
        if (!relocationChoice) {
            isValid = false;
            errorMessages.push("An Accepted Relocation Choice must be selected before setting status to 'Accepted'.");
        }
    }

    // Final validation check
    if (!isValid) {
        Xrm.Navigation.openAlertDialog({ text: errorMessages.join("\n") });
        executionContext.getEventArgs().preventDefault();
    }
};