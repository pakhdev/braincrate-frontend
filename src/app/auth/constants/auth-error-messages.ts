import { AuthErrorMessage } from '../../shared/store/auth/interfaces/auth-error-message.interface';

const authErrorMessages: AuthErrorMessage[] = [
    { code: 'required', description: 'Este campo es requerido' },
    { code: 'minlength', description: 'Mínimo {requiredLength} caractéres' },
    { code: 'pattern', description: 'Dirección de correo electrónico incorrecta' },
    { code: 'notEqual', description: 'Las contraseñas no coinciden' },
    { code: 'emailTaken', description: 'Este correo electrónico ya está registrado' },
    { code: 'emailMatchesOld', description: 'El correo electrónico coincide con el antiguo' },
    { code: 'userNotFound', description: 'El usuario no existe' },
    { code: 'wrongPassword', description: 'La contraseña es incorrecta' },
    { code: 'wrongOldPassword', description: 'La contraseña antigua es incorrecta' },
    { code: 'passwordMatchesOld', description: 'La contraseña coincide con la antigua' },
    {
        code: 'setPasswordBeforeEmailUpdate',
        description: 'Debes establecer una contraseña antes de cambiar el correo electrónico, porque tu cuenta se creó con Google',
    },
];
