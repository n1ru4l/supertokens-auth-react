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
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useContext } from "react";
import StyleContext, { StyleProvider } from "../../../../../styles/styleContext";
import { defaultPalette } from "../../../../../styles/styles";
import { getStyles } from "../../../components/themes/styles";
import { hasFontDefined } from "../../../../../styles/styles";
import { SignUpFooter } from "./signUpFooter";
import { SignInAndUpThemeProps } from "../../../types";
import { ThemeBase } from "../themeBase";
import { ProvidersForm } from "./providersForm";
import { SuperTokensBranding } from "../../../../../components/SuperTokensBranding";
import { useTranslation } from "../../../../..";
import GeneralError from "../../../../emailpassword/components/library/generalError";

const SignInAndUpTheme: React.FC<SignInAndUpThemeProps> = (props) => {
    const t = useTranslation();
    const styles = useContext(StyleContext);

    return (
        <div data-supertokens="container" css={styles.container}>
            <div data-supertokens="row" css={styles.row}>
                <div data-supertokens="headerTitle" css={styles.headerTitle}>
                    {t("THIRD_PARTY_SIGN_IN_AND_UP_HEADER_TITLE")}
                </div>

                <div data-supertokens="divider" css={styles.divider}></div>

                {props.featureState.error && <GeneralError error={props.featureState.error} />}

                <ProvidersForm {...props} />

                <SignUpFooter
                    privacyPolicyLink={props.config.signInAndUpFeature.privacyPolicyLink}
                    termsOfServiceLink={props.config.signInAndUpFeature.termsOfServiceLink}
                />
            </div>
            <SuperTokensBranding />
        </div>
    );
};

const SignInAndUpThemeWrapper: React.FC<SignInAndUpThemeProps> = (props) => {
    const hasFont = hasFontDefined(props.config.rootStyle);

    return (
        <ThemeBase loadDefaultFont={!hasFont}>
            <StyleProvider
                rawPalette={props.config.palette}
                defaultPalette={defaultPalette}
                styleFromInit={props.config.signInAndUpFeature.style}
                rootStyleFromInit={props.config.rootStyle}
                getDefaultStyles={getStyles}>
                <SignInAndUpTheme {...props} />
            </StyleProvider>
        </ThemeBase>
    );
};

export default SignInAndUpThemeWrapper;
