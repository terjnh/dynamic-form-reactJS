import React from "react";
import Field from "./Field";

const ParentField = ({ field, fieldChanged, type, value }) => {
    return (
        <input
            type={type}
            id="parentTestName"
            name={field.name}
            value={value}
            placeholder={field.name}
            onChange={(e) => {
                // Notify the main state list of the new value
                fieldChanged(field.name, e.target.value);
            }}
        />
    )
}


export default ParentField;