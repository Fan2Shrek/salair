export function useFormValidation() {
  const validateSiret = (siret: string) => {
    return siret.length === 14 && /^\d+$/.test(siret);
  };
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  return { validateSiret, validateEmail };
}