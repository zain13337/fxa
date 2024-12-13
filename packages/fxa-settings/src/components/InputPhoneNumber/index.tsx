/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState } from 'react';
import InputText from '../InputText';
import { useFtlMsgResolver } from '../../models';
import { UseFormMethods } from 'react-hook-form';

interface Country {
  id: number;
  code: string;
  classNameFlag: string;
  name: string;
  ftlId: string;
  validationPattern: RegExp;
  placeholder: string;
}

export const phoneNorthAmerica = {
  placeholder: '123-123-1234',
  // North American Numbering Plan (NANP) countries are 123-123-1234.
  // This allows for spaces, dot-separation, and parenthesis, but keeps
  // the number of digits to 10.
  validationPattern: /^\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}$/,
};

export const defaultCountries = [
  // We need IDs because country codes can be the same, and countries
  // can have multiple country codes, so 'name' isn't necessarily unique.
  {
    // Currently, the country with an ID of 1 is the default selected country
    // as well as the country always shown at the top of the drop down list.
    // Also, when we expand this list, we'll want to sort alphabetically by name.
    id: 1,
    code: '+1',
    classNameFlag: 'bg-flag-usa',
    name: 'United States',
    ftlId: 'input-phone-number-country-united-states',
    ...phoneNorthAmerica,
  },
  {
    id: 2,
    code: '+1',
    classNameFlag: 'bg-flag-canada',
    name: 'Canada',
    ftlId: 'input-phone-number-country-canada',
    ...phoneNorthAmerica,
  },
];

const InputPhoneNumber = ({
  countries = defaultCountries,
  register,
}: {
  countries?: Country[];
  register: UseFormMethods['register'];
}) => {
  const ftlMsgResolver = useFtlMsgResolver();
  const localizedCountries = countries.map((country) => ({
    ...country,
    localizedName: ftlMsgResolver.getMsg(country.ftlId, country.name),
  }));
  const defaultCountry =
    localizedCountries.find((country) => country.id === 1) ||
    localizedCountries[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const localizedLabel = ftlMsgResolver.getMsg(
    'input-phone-number-enter-number',
    'Enter phone number'
  );

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = localizedCountries.find(
      (country) => country.id === parseInt(event.target.value, 10)
    );
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
    }
  };

  return (
    <div className="flex">
      <select
        onChange={handleCountryChange}
        value={selectedCountry.id}
        className={`bg-transparent border border-grey-200 rounded-md py-2 ps-10 w-[60px] me-2 focus:border-blue-400 focus:outline-none focus:shadow-input-blue-focus ${selectedCountry.classNameFlag} bg-no-repeat bg-[length:1.5rem_1rem] bg-[40%_50%]`}
      >
        {/* Default country is always first */}
        <option
          className={`${defaultCountry.classNameFlag} bg-contain`}
          value={defaultCountry.id}
        >
          {defaultCountry.localizedName} ({defaultCountry.code})
        </option>

        {/* Note, at the time of writing we're using react-dom 18.3 which complains about
        <hr> inside <select> being invalid, but it is valid. This should be fixed in later
         versions: https://github.com/facebook/react/issues/27572 */}
        <hr className="my-1" />

        {localizedCountries
          .filter((country) => country.id !== defaultCountry.id)
          .map((country) => (
            <option
              key={country.id}
              value={country.id}
              className={`${country.classNameFlag} bg-contain`}
            >
              {country.localizedName} ({country.code})
            </option>
          ))}
      </select>

      {/* Because the country code may not be unique, the above `select`'s `value` must
       be by country ID. This hidden input allows us to access it in the form data. */}
      <input
        type="hidden"
        name="countryCode"
        value={selectedCountry.code}
        ref={register()}
      />
      <InputText
        name="phoneNumber"
        type="tel"
        label={localizedLabel}
        autoFocus
        required
        className="text-start w-full"
        anchorPosition="start"
        autoComplete="off"
        spellCheck={false}
        tooltipPosition="bottom"
        placeholder={selectedCountry.placeholder}
        inputRef={register({
          required: true,
          pattern: selectedCountry.validationPattern,
        })}
      />
    </div>
  );
};

export default InputPhoneNumber;
