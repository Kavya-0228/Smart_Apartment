import { useState } from 'react';

type Rules<T> = Partial<Record<keyof T, (v: string) => string | undefined>>;

export function useForm<T extends Record<string, string>>(initial: T, rules?: Rules<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const set = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
    if (touched[field] && rules?.[field]) {
      const err = rules[field]!(e.target.value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const blur = (field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (rules?.[field]) {
      const err = rules[field]!(values[field]);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const validate = (): boolean => {
    if (!rules) return true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;
    for (const field in rules) {
      const err = rules[field]!(values[field]);
      if (err) { newErrors[field] = err; valid = false; }
    }
    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return valid;
  };

  const reset = () => { setValues(initial); setErrors({}); setTouched({}); };

  return { values, errors, set, blur, validate, reset };
}
