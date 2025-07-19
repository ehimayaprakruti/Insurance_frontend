import React, { useState } from 'react';
import API from './api';

const PremiumForm = () => {
  const [form, setForm] = useState({
    age: '',
    gender: 'male',
    isSmoker: false,
    preExistingCondition: false,
    sumInsured: 100000,
    policyTenure: 1,
    policy: 'basic',
    addOns: [],
  });
  const [premium, setPremium] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddOnChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      addOns: checked
        ? [...prev.addOns, value]
        : prev.addOns.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first.');
      return;
    }
    setError('');
    try {
      const res = await API.post('/calculate', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPremium(res.data.premium);
      setBreakdown(res.data.breakdown);
    } catch (err) {
      setPremium(null);
      setBreakdown(null);
      setError(err.response?.data?.message || 'Calculation failed.');
    }
  };

  return (
    <div className="form">
      <h2>====== Insurance Premium Calculator ======</h2>
      <div>
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={form.gender === 'male'}
            onChange={handleChange}
          />{' '}
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={form.gender === 'female'}
            onChange={handleChange}
          />{' '}
          Female
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="isSmoker"
            checked={form.isSmoker}
            onChange={handleChange}
          />{' '}
          Smoker
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="preExistingCondition"
            checked={form.preExistingCondition}
            onChange={handleChange}
          />{' '}
          Pre-existing condition
        </label>
      </div>
      <div>
        <input
          name="sumInsured"
          type="number"
          placeholder="Sum Insured"
          value={form.sumInsured}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div>
        <input
          name="policyTenure"
          type="number"
          placeholder="Policy Tenure"
          value={form.policyTenure}
          onChange={handleChange}
          min={1}
        />
      </div>
      <div>
        <select name="policy" value={form.policy} onChange={handleChange}>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <fieldset>
        <legend>Add-ons:</legend>
        <label>
          <input
            type="checkbox"
            value="criticalIllness"
            checked={form.addOns.includes('criticalIllness')}
            onChange={handleAddOnChange}
          />{' '}
          Critical Illness
        </label>
        <label>
          <input
            type="checkbox"
            value="accidentCover"
            checked={form.addOns.includes('accidentCover')}
            onChange={handleAddOnChange}
          />{' '}
          Accident Cover
        </label>
        <label>
          <input
            type="checkbox"
            value="hospitalCash"
            checked={form.addOns.includes('hospitalCash')}
            onChange={handleAddOnChange}
          />{' '}
          Hospital Cash
        </label>
      </fieldset>
      <button type="button" onClick={handleSubmit}>
        Calculate
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {premium && (
        <div>
          <h3>Total Premium: ${premium}</h3>
          <pre>{JSON.stringify(breakdown, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PremiumForm;
