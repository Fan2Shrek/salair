export interface PasswordRule {
    test: (password: string) => boolean;
    message: string;
    isValid: boolean;
}

export interface ValidatedPasswordRule extends PasswordRule {
    isValid: boolean;
}

/**
 * Définit les règles de validation pour les mots de passe
 */
export const passwordRules: PasswordRule[] = [
    {
        test: (password: string) => password.length >= 8,
        message: 'Au moins 8 caractères',
        isValid: false
    },
    {
        test: (password: string) => /[A-Z]/.test(password),
        message: 'Au moins une majuscule',
        isValid: false
    },
    {
        test: (password: string) => /[a-z]/.test(password),
        message: 'Au moins une minuscule',
        isValid: false
    },
    {
        test: (password: string) => /[0-9]/.test(password),
        message: 'Au moins un chiffre',
        isValid: false
    },
    {
        test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        message: 'Au moins un caractère spécial',
        isValid: false
    }
];

/**
 * Valide un mot de passe contre toutes les règles définies
 * @param password Le mot de passe à valider
 * @returns Un tableau des règles avec leur statut de validation
 */
export function validatePassword(password: string): ValidatedPasswordRule[] {
    return passwordRules.map(rule => ({
        ...rule,
        isValid: password ? rule.test(password) : false
    }));
}

/**
 * Vérifie si un mot de passe respecte toutes les règles
 * @param password Le mot de passe à vérifier
 * @returns true si le mot de passe est valide, false sinon
 */
export function isPasswordValid(password: string): boolean {
    return validatePassword(password).every(rule => rule.isValid);
}

/**
 * Vérifie si deux mots de passe correspondent
 * @param password Le premier mot de passe
 * @param confirmPassword Le mot de passe de confirmation
 * @returns true si les mots de passe correspondent et ne sont pas vides
 */
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword && password.length > 0;
}

/**
 * Valide un formulaire complet de mot de passe
 * @param password Le mot de passe principal
 * @param confirmPassword Le mot de passe de confirmation
 * @returns Un objet contenant les informations de validation
 */
export function validatePasswordForm(password: string, confirmPassword: string) {
    const rules = validatePassword(password);
    const isValid = rules.every(rule => rule.isValid);
    const passwordsMatch = doPasswordsMatch(password, confirmPassword);
    
    return {
        rules,
        isPasswordValid: isValid,
        passwordsMatch,
        isFormValid: isValid && passwordsMatch
    };
}
