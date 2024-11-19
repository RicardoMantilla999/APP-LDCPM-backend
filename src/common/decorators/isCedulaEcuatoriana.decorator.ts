import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validarCedulaEcuatoriana } from '../validators/validaciones.validators';

export function IsCedulaEcuatoriana(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCedulaEcuatoriana',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          return validarCedulaEcuatoriana(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no es una cédula ecuatoriana válida.`;
        },
      },
    });
  };
}
