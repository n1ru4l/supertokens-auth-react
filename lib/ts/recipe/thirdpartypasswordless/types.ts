/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Imports.
 */
import { FeatureBaseConfig, NormalisedBaseConfig, Styles } from "../../types";
import {
    GetRedirectionURLContext as PasswordlessGetRedirectionURLContext,
    OnHandleEventContext as PasswordlessOnHandleEventContext,
    PreAPIHookContext as PasswordlessPreAPIHookContext,
} from "../passwordless";
import {
    NormalisedConfig as PasswordlessConfig,
    PasswordlessFeatureBaseConfig,
    PasswordlessUser,
    SignInUpFeatureConfigInput as PWLessSignInUpFeatureConfigInput,
} from "../passwordless/types";
import {
    GetRedirectionURLContext as ThirdPartyGetRedirectionURLContext,
    OnHandleEventContext as ThirdPartyOnHandleEventContext,
    PreAPIHookContext as ThirdPartyPreAPIHookContext,
} from "../thirdparty";
import { NormalisedConfig as TPConfig, StateObject } from "../thirdparty/types";
import Provider from "../thirdparty/providers";
import { CustomProviderConfig } from "../thirdparty/providers/types";
import {
    Config as AuthRecipeModuleConfig,
    NormalisedConfig as NormalisedAuthRecipeModuleConfig,
    UserInput as AuthRecipeModuleUserInput,
    User,
    UserInputOverride as AuthRecipeUserInputOverride,
} from "../authRecipeWithEmailVerification/types";
import PWlessRecipe from "../passwordless/recipe";
import TPRecipe from "../thirdparty/recipe";
import OverrideableBuilder from "supertokens-js-override";

import { ComponentOverride } from "../../components/componentOverride/componentOverride";
import { ComponentOverrideMap as PasswordlessOverrideMap } from "../passwordless/types";
import { ComponentOverrideMap as ThirdPartyOverrideMap } from "../thirdparty/types";
import { Header } from "./components/themes/signInUp/header";
import { CountryCode } from "libphonenumber-js";

type WithRenamedProp<T, K extends keyof T, L extends string> = Omit<T, K> & {
    [P in L]: T[K];
};

export type ComponentOverrideMap = Omit<PasswordlessOverrideMap, "PasswordlessSignInUpHeader"> &
    Omit<ThirdPartyOverrideMap, "ThirdPartySignUpFooter" | "ThirdPartySignUpHeader"> & {
        ThirdPartyPasswordlessHeader?: ComponentOverride<typeof Header>;
    };

export type SignInUpFeatureConfigInput = WithRenamedProp<
    PWLessSignInUpFeatureConfigInput,
    "emailOrPhoneFormStyle",
    "providerAndEmailOrPhoneFormStyle"
> & {
    providers?: (Provider | CustomProviderConfig)[];
};

export type UserInput = (
    | {
          contactMethod: "EMAIL";

          validateEmailAddress?: (email: string) => Promise<string | undefined> | string | undefined;

          signInUpFeature?: SignInUpFeatureConfigInput;
      }
    | {
          contactMethod: "PHONE";

          validatePhoneNumber?: (phoneNumber: string) => Promise<string | undefined> | string | undefined;

          signInUpFeature?: SignInUpFeatureConfigInput & {
              /*
               * Must be a two-letter ISO country code (e.g.: "US")
               */
              defaultCountry?: CountryCode;
          };
      }
    | {
          contactMethod: "EMAIL_OR_PHONE";

          validateEmailAddress?: (email: string) => Promise<string | undefined> | string | undefined;
          validatePhoneNumber?: (phoneNumber: string) => Promise<string | undefined> | string | undefined;

          signInUpFeature?: SignInUpFeatureConfigInput & {
              guessInternationPhoneNumberFromInputPhoneNumber?: (
                  inputPhoneNumber: string,
                  defaultCountryFromConfig?: CountryCode
              ) => Promise<string | undefined> | string | undefined;
          };
      }
) & {
    override?: {
        functions?: (
            originalImplementation: TPPWlessRecipeInterface,
            builder?: OverrideableBuilder<TPPWlessRecipeInterface>
        ) => TPPWlessRecipeInterface;
        components?: ComponentOverrideMap;
    } & AuthRecipeUserInputOverride;
    linkClickedScreenFeature?: PasswordlessFeatureBaseConfig;
    oAuthCallbackScreen?: FeatureBaseConfig;
    disablePasswordless?: boolean;
} & AuthRecipeModuleUserInput<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext>;

export type Config = UserInput &
    AuthRecipeModuleConfig<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext>;

export type NormalizedSignInUpFeatureConfig = {
    resendEmailOrSMSGapInSeconds: number;
    providers?: (Provider | CustomProviderConfig)[];
    defaultCountry?: CountryCode;
    guessInternationPhoneNumberFromInputPhoneNumber: (
        inputPhoneNumber: string,
        defaultCountryFromConfig?: CountryCode
    ) => Promise<string | undefined> | string | undefined;
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
    // TODO: better name
    providerAndEmailOrPhoneFormStyle: Styles;
    userInputCodeFormStyle: Styles;
    linkSentScreenStyle: Styles;
    closeTabScreenStyle: Styles;
    disableDefaultImplementation?: boolean;
};

export type NormalisedConfig = {
    contactMethod: "PHONE" | "EMAIL" | "EMAIL_OR_PHONE";

    validateEmailAddress: (email: string) => Promise<string | undefined> | string | undefined;
    validatePhoneNumber: (phoneNumber: string) => Promise<string | undefined> | string | undefined;

    signInUpFeature: NormalizedSignInUpFeatureConfig;

    linkClickedScreenFeature: NormalisedBaseConfig & {
        disableDefaultImplementation: boolean;
    };

    oAuthCallbackScreen: NormalisedBaseConfig;
    disablePasswordless: boolean;
    override: {
        functions: (
            originalImplementation: TPPWlessRecipeInterface,
            builder?: OverrideableBuilder<TPPWlessRecipeInterface>
        ) => TPPWlessRecipeInterface;
        components: ComponentOverrideMap;
    };
} & NormalisedAuthRecipeModuleConfig<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext>;

export type GetRedirectionURLContext = PasswordlessGetRedirectionURLContext | ThirdPartyGetRedirectionURLContext;

export type PreAPIHookContext = PasswordlessPreAPIHookContext | ThirdPartyPreAPIHookContext;

export type OnHandleEventContext = PasswordlessOnHandleEventContext | ThirdPartyOnHandleEventContext;

export type ThirdPartyPasswordlessSignInAndUpThemeProps = {
    history?: any;
    passwordlessRecipe?: PWlessRecipe;
    thirdPartyRecipe?: TPRecipe;
    config: NormalisedConfig;
};

export type TPPWlessRecipeInterface = {
    createCode: (
        input: ({ email: string } | { phoneNumber: string }) & {
            config: PasswordlessConfig;
        }
    ) => Promise<
        | {
              status: "OK";
              deviceId: string;
              preAuthSessionId: string;
              flowType: "USER_INPUT_CODE" | "MAGIC_LINK" | "USER_INPUT_CODE_AND_MAGIC_LINK";
          }
        | { status: "GENERAL_ERROR"; message: string }
    >;
    resendCode: (
        input: { deviceId: string; preAuthSessionId: string } & {
            config: PasswordlessConfig;
        }
    ) => Promise<
        | {
              status: "OK" | "RESTART_FLOW_ERROR";
          }
        | { status: "GENERAL_ERROR"; message: string }
    >;

    consumeCode: (
        input: (
            | {
                  userInputCode: string;
                  deviceId: string;
                  preAuthSessionId: string;
              }
            | {
                  preAuthSessionId: string;
                  linkCode: string;
              }
        ) & {
            config: PasswordlessConfig;
        }
    ) => Promise<
        | {
              status: "OK";
              createdUser: boolean;
              user: PasswordlessUser;
          }
        | {
              status: "INCORRECT_USER_INPUT_CODE_ERROR" | "EXPIRED_USER_INPUT_CODE_ERROR";
              failedCodeInputAttemptCount: number;
              maximumCodeInputAttempts: number;
          }
        | { status: "GENERAL_ERROR"; message: string }
        | { status: "RESTART_FLOW_ERROR" }
    >;

    doesEmailExist: (input: { email: string; config: PasswordlessConfig }) => Promise<boolean>;
    doesPhoneNumberExist: (input: { phoneNumber: string; config: PasswordlessConfig }) => Promise<boolean>;

    getLoginAttemptInfo: () =>
        | Promise<
              | undefined
              | {
                    deviceId: string;
                    preAuthSessionId: string;
                    contactInfo: string;
                    contactMethod: "EMAIL" | "PHONE";
                    flowType: "USER_INPUT_CODE" | "MAGIC_LINK" | "USER_INPUT_CODE_AND_MAGIC_LINK";
                    lastResend: number;
                    redirectToPath?: string;
                }
          >
        | {
              deviceId: string;
              preAuthSessionId: string;
              contactInfo: string;
              contactMethod: "EMAIL" | "PHONE";
              flowType: "USER_INPUT_CODE" | "MAGIC_LINK" | "USER_INPUT_CODE_AND_MAGIC_LINK";
              lastResend: number;
              redirectToPath?: string;
          }
        | undefined;
    setLoginAttemptInfo: (input: {
        deviceId: string;
        preAuthSessionId: string;
        contactInfo: string;
        contactMethod: "EMAIL" | "PHONE";
        flowType: "USER_INPUT_CODE" | "MAGIC_LINK" | "USER_INPUT_CODE_AND_MAGIC_LINK";
        lastResend: number;
        redirectToPath?: string;
    }) => Promise<void> | void;
    clearLoginAttemptInfo: () => Promise<void> | void;

    getOAuthAuthorisationURL: (input: { thirdPartyId: string; config: TPConfig }) => Promise<string>;

    signInAndUp: (input: { thirdPartyId: string; config: TPConfig }) => Promise<
        | {
              status: "OK";
              user: User;
              createdNewUser: boolean;
          }
        | {
              status: "NO_EMAIL_GIVEN_BY_PROVIDER" | "GENERAL_ERROR";
          }
        | {
              status: "FIELD_ERROR";
              error: string;
          }
    >;

    getOAuthState(): StateObject | undefined;

    setOAuthState(state: StateObject): void;

    redirectToThirdPartyLogin: (input: {
        thirdPartyId: string;
        config: TPConfig;
        state?: StateObject;
    }) => Promise<{ status: "OK" | "ERROR" }>;
};
