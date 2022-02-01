import React, { useState } from 'react'
import { useValidity, useVerifyFormValidity, validate } from 'react-validity';

const IDS = new WeakMap();
const uniqueId = ((i) => () => ++i)(0);

function idFor(ref) {
  let id = IDS.get(ref) ?? `userForm-${uniqueId()}`;
  IDS.set(ref, id);
  return id;
}

function validatePassword() {
  return ({ value }) => {
    let requirements = [
      [/.{6,}/, 'Password must be at least six characters long.'],
      [/[0-9]/, 'Password must contain at least one number.'],
      [/[a-z]/, 'Password must contain at least one lowercase letter.'],
      [/[A-Z]/, 'Password must contain at least one uppercase letter.'],
      [/[^a-zA-Z0-9\s]/, 'Password must contain at least one special character.'],
    ];
    return requirements
      .map(([predicate, message]) => predicate.test(value) ? null : message)
      .filter(Boolean);
  };
}

function validateConfirmation(passwordRef) {
  return ({ value }) => passwordRef.current.value === value
    ? []
    : ['Confirmation must match password'];
}

export function ExampleForm() {
  let [validationMessages, setValidationMessages] = useState({});
  let validatedHandler = (event) => {
    let { name, validationMessage } = event.target;
    setValidationMessages(v => ({ ...v, [name]: validationMessage }));
  };

  let userForm = useVerifyFormValidity({
    validated: validatedHandler,
    submit: ({ target }) => alert(JSON.stringify(Object.fromEntries(new FormData(target))))
  });

  let name = useValidity();
  let phone = useValidity();
  let email = useValidity();
  let contactMethod = useValidity();
  let password = useValidity(validatePassword());
  let confirmPassword = useValidity(validateConfirmation(password));

  return (
    <form ref={userForm}>
      <div className='full-width text-right'>
        <sup className='required'>*</sup> Required
      </div>

      <label htmlFor={idFor(name)}>
        Name<sup className='required'>*</sup>
      </label>
      <input ref={name} id={idFor(name)} name='name' required />
      <span className='validation-message'>{validationMessages.name}</span>

      <label htmlFor={idFor(phone)}>Phone</label>
      <input ref={phone} id={idFor(phone)} name='phone' type='tel' />
      <span className='validation-message'>{validationMessages.phone}</span>

      <label htmlFor={idFor(email)}>
        Email<sup className='required'>*</sup>
      </label>
      <input ref={email} id={idFor(email)} name='email' type='email' required />
      <span className='validation-message'>{validationMessages.email}</span>

      <label htmlFor={idFor(contactMethod)}>Contact method</label>
      <select ref={contactMethod} id={idFor(contactMethod)} name='contactMethod' required>
        <option value=''>—Please pick one—</option>
        <option value='phone'>Phone</option>
        <option value='email'>Email</option>
        <option value='no-contact'>Do not contact me</option>
      </select>
      <span className='validation-message'>{validationMessages.contactMethod}</span>

      <label htmlFor={idFor(password)}>
        Password<sup className='required'>*</sup>
      </label>
      <input
        ref={password}
        id={idFor(password)}
        name='password'
        type='password'
        required
        onInput={() => validate(confirmPassword.current)}
      />
      <span className='validation-message'>{validationMessages.password}</span>

      <label htmlFor={idFor(confirmPassword)}>
        Confirm password<sup className='required'>*</sup>
      </label>
      <input
        ref={confirmPassword}
        id={idFor(confirmPassword)}
        name='confirm'
        type='password'
        required
      />
      <span className='validation-message'>{validationMessages.confirm}</span>

      <button type='submit'>Create</button>
    </form>
  );
}
