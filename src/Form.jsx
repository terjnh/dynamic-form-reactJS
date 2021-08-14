import React, { useState, useEffect } from "react";
import FieldGroup from "./FieldGroup";
import Field from "./Field";
import Option from "./Option";
import ParentField from "./ParentField";

// fieldMeetsCondition is a function that returns a function, we do this so
//  - that we can simplify how it's passed to the Array.filter before the
//    Array.map call
//  - Within the function it will attempt to find the field in the values 
//    dictionary and match it with the required value. 
//    If no condition exists then we’ll bail out and render the field.
const fieldMeetsCondition = (values) => (field) => {
    if (field.conditional && field.conditional.field) {
        const segments = field.conditional.field.split("_");
        const fieldId = segments[segments.length - 1];
        return values[fieldId] === field.conditional.value;
    }
    return true;
};



const Form = ({ formData }) => {

    // state to track the current page ID of the form
    const [page, setPage] = useState(0);

    // state to track the current form data that will be displayed -
    //   - this is plucked from the array, so we don't need to constantly grab it & we can
    //   respond to it changing using the `useEffect` Hook if required.
    const [currentPageData, setCurrentPageData] = useState(formData.tests[page]);

    // track the values of the form fields
    //   - The values object is going to act as a dictionary so we can do values[field._uid] 
    //     to get the value out for a field, but as per the requirements of a Controlled 
    //     Component, we need to initialise the value, and we can do that with 
    //     the useEffect Hook
    const [values, setValues] = useState({});


    let parentTestNum = page + 1;

    // this effect will run when the `page` changes
    useEffect(() => {
        const upcomingPageData = formData.tests[page];
        setCurrentPageData(upcomingPageData);

        // replace upcomingPageData.fields in `template`
        // console.log("upcomingPageData.tests[page].subtests.tests: " 
        //     + JSON.stringify(upcomingPageData.subtests.tests, null, 2))
        let subTests = upcomingPageData.subtests.tests;

        setValues(currentValues => {
            // the `reduce` method iterate over the subTests, and builds up a new object
            // containing the newly-initialised subTests.
            const newValues = subTests.reduce((obj, field) => {
                // When newValues are set --> initialize with empty object
                obj = {};
                // or initialize with field.name
                // obj[field.name] = "";

                // console.log("useEffect-obj: " + JSON.stringify(obj));
                return obj;
            }, {});

            // console.log("obj returned: " + JSON.stringify(Object.assign({}, newValues, currentValues)))
            return Object.assign({}, newValues, currentValues);
        });
    }, [page, formData]);

    // callback provided to components to update the main list of form values
    //  - The fieldChanged function will receive the fieldId (field._uid) and the new value. 
    //    When called it’ll update the values state with the new value and then force a 
    //    render by faking an update of the currentPageData state value, using Object.assign.
    const fieldChanged = (fieldId, value) => {
        // use a callback to find the field in the value list and update it
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            console.log("currentValues: " + JSON.stringify(currentValues, null, 2))
            return currentValues;
        });
        

        // this just fakes that we've updated the `currentPageData` to force a re-render in React
        setCurrentPageData((currentPageData) => {
            return Object.assign({}, currentPageData);
        });
    }

    const testFunction = (fieldId, value) => {
        setValues((currentValues) => {
            currentValues[fieldId] = value;
            console.log("Parent currentValues: " + JSON.stringify(currentValues, null, 2))
            return currentValues;
        });
    }


    const navigatePages = (direction) => () => {
        const findNextPage = (page) => {
            const upcomingPageData = formData.tests[page];
            // if(
            //     upcomingPageData.condiitonal && 
            //     upcomingPageData.conditional.field
            // ) {
            //     const segments = upcomingPageData.conditional.field.split("_");
            //     const fieldId = segments[segments.length - 1];

            //     const fieldToMatchValue = values[fieldId];

            //     if (fieldToMatchValue !== upcomingPageData.conditional.value) {
            //         return findNextPage(direction === "next" ? page + 1 : page - 1);
            //     }
            // }
            return page;
        };

        setPage(findNextPage(direction === "next" ? page + 1 : page - 1));

        // Reset form
        document.getElementById("config-form").reset();

    };
    const nextPage = navigatePages("next");
    const prevPage = navigatePages("prev");


    const onDumpClicked = () => {
        // e.preventDefault();
        // todo - send data somewhere
        for (var uid in values) {
            // console.log("values --- " + JSON.stringify(values, null, 2))

            // Do not modify if values[uid] = ""
            if (values[uid] !== "") {
                console.log("Edit value === " + values[uid])
                editTree(formData, uid, values[uid])
            }
        }
        console.log("onDumpClicked-->formData: " + JSON.stringify(formData, null, 2))
    };

    const onSubmit = (e) => {
        e.preventDefault();
    }

    // editTree modifies the JSON's "label" key-value based on "_uid"
    //   - Note: Recursive function
    function editTree(tree, id, val) {
        for (var i in tree) {
            if (i == 'name') {
                if (tree[i] == id) {
                    // console.log("tree[i] == id -> " + tree[i] + "=====" + id)
                    tree.name = val
                    return 1;
                }
            }
            if (i == 'message') {
                if (tree[i] == id) {
                    // console.log("tree[i] == id -> " + tree[i] + "=====" + id)
                    tree.message = val
                    return 1;
                }
            }


            // console.log("typeof tree[i]: " + (typeof(tree[i]) + ", " + tree[i]))
            if (typeof tree[i] == 'object') {
                editTree(tree[i], id, val)
            } else {
                // console.log("tree[i] no longer an OBJECT. Move on...")
            }
        }
        return tree;
    }


    return (
        <form id="config-form" onSubmit={onSubmit}>
            <h2>{formData.tests[page].id}</h2>
            <h4>Parent Test</h4>
            <ParentField
                key={formData.tests[page].id}
                field={formData.tests[page]}
                fieldChanged={testFunction}
                values={values[formData.tests[page].message]}
            />
            {/* <Field
                key={formData.tests[page].id}
                field={formData.tests[page]}
                fieldChanged={fieldChanged}
                values={values[formData.tests.name]}
            /> */}
            <h4>Sub-Test(s)</h4>
            {currentPageData.subtests.tests
                // .filter(fieldMeetsCondition(values))
                .map((field) => {
                    switch (field.typeCommand) {
                        case "PassFail":
                            return (
                                <Field
                                    key={field.typeCommand}
                                    field={field}
                                    fieldChanged={fieldChanged}
                                    values={values[field.name]}
                                />
                            );
                        default:
                            return (null
                                // <Field
                                //     key={field._uid}
                                //     field={field}
                                //     fieldChanged={fieldChanged}
                                //     value={values[field._uid]}
                                // />
                            );
                    }
                })}

            {/* {page > 0 && <button onClick={prevPage}>Back</button>}&nbsp; */}
            {page < (formData.tests.length - 1) && <button onClick={nextPage}>Next</button>}
            <hr />
            {page >= (formData.tests.length - 1) &&
                <button onClick={(onDumpClicked)}>Dump form data</button>}
        </form>
    );
};

export default Form;
