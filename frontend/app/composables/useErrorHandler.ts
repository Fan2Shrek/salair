export function useErrorHandler() {
  const { error } = useToast();
  
  const handleAuthError = (errorCode: string) => {
    const messages: { [key: string]: string } = {
      'Invalid user credentials': 'Votre email ou mot de passe est incorrect',
      'Network error': 'Problème de connexion',
    };

    error('Erreur', messages[errorCode] || 'Une erreur inattendue s\'est produite');
  };
  
  return { handleAuthError };
}