import React from "react";

const Field = ({ field, fieldChanged, type, value }) => {
  return (
    <div key={field.typeCommand}>
      <label>{field.id}</label>
      <br></br>
      <hr class="break-xsm"></hr>
      <label htmlFor="childTestName">name: </label>
      <input
        type={type || field.component}
        id="childTestName"
        name={field.name}
        value={value}
        placeholder={field.name}
        onChange={(e) => {
          // Notify the main state list of the new value
          fieldChanged(field.name, e.target.value);
        }}
      />
      <hr class="break-xsm"></hr>
      <label htmlFor="childTestMessage">message: </label>
      <input
        type={type || field.component}
        id="childTestMessage"
        name={field.message}
        value={value}
        placeholder={field.message}
        onChange={(e) => {
          // Notify the main state list of the new value
          fieldChanged(field.message, e.target.value);
        }}
      />
      <hr class="break-sm"></hr>
    </div>
  );
};


export default Field;


// This will render out a label and input in a basic manner, update the HTML to the structure 
// that’s required for your design (or render out fields from a form library like Formik). 
// The two props that are likely to be of most interest as the value and fieldChanged. 
// The value prop is the current value for the Controlled Component, which will come from the 
// Form component itself (we’ve not implemented that yet) and fieldChanged will be used to 
// update this main state list.
