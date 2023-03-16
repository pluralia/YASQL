import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { YASQLGeneratedModule, YasqlGeneratedSharedModule } from './generated/module';
import { YasqlScopeProvider } from './yasql-scope-provider';
import { YasqlValidator, registerValidationChecks } from './yasql-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type YasqlAddedServices = {
    validation: {
        YasqlValidator: YasqlValidator
    },
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type YasqlServices = LangiumServices & YasqlAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const YasqlModule: Module<YasqlServices, PartialLangiumServices & YasqlAddedServices> = {
    references: {
        ScopeProvider: (services) => new YasqlScopeProvider(services),
    },
    validation: {
        YasqlValidator: () => new YasqlValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createYasqlServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    Yasql: YasqlServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        YasqlGeneratedSharedModule
    );
    const Yasql = inject(
        createDefaultModule({ shared }),
        YASQLGeneratedModule,
        YasqlModule
    );
    shared.ServiceRegistry.register(Yasql);
    registerValidationChecks(Yasql);
    return { shared, Yasql };
}
