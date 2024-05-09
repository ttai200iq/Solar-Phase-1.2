import React from 'react';
import { IntlProvider } from 'react-intl'
import { messages } from './Contant'
import { useSelector } from 'react-redux';

export const LanguageProvider = ({ children }) => {
    const lang = useSelector((state) => state.admin.lang)
    return (
        <IntlProvider
            locale={lang}
            messages={messages[lang]}
            defaultLocale={lang}
        >
            {children}
        </IntlProvider>
    );
}

