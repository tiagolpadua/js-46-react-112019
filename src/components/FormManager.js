import React, { useState, useEffect } from "react";
export const FormManager = ({ children, initialValues, onFormValidation }) => {
  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState({ ...initialValues });
  const [touched, setTouched] = useState({ ...initialValues });

  useEffect(() => {
    setErrors(onFormValidation(values));
  }, [onFormValidation, values]);

  const onFormFieldChange = ({ target }) => {
    const value = target.value;
    const name = target.name;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
  };

  const onFormFieldBlur = ({ target }) => {
    setTouched({ ...touched, [target.name]: true });
  };

  return (
    <React.Fragment>
      {children &&
        children({
          values,
          errors,
          touched,
          onFormFieldChange,
          onFormFieldBlur
        })}
    </React.Fragment>
  );
};
