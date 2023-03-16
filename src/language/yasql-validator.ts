import { ValidationChecks } from 'langium';
import { YasqlAstType } from './generated/ast';
import type { YasqlServices } from './yasql-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: YasqlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.YasqlValidator;
    const checks: ValidationChecks<YasqlAstType> = {
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class YasqlValidator {

}
