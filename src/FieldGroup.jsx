import React from "react";
import Field from "./Field";

const FieldGroup = ({ field, fieldChanged, values }) => {
  const fields = field.fields;

  return (
    <fieldset key={field._uid}>
      <h3>{field.label}</h3>
      {fields.map((field) => {
        return (
          <Field
            key={field.typeCommand}
            field={field}
            fieldChanged={fieldChanged}
            value={values[field._uid]}
          />
        );
      })}
    </fieldset>
  );
};

export default FieldGroup;
