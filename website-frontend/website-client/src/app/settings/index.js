export { default as SettingsPlaceholder } from './pages/SettingsPlaceholder'
export { setLanguage, settingsReducer } from './redux/slice'
export { selectSettingsState, selectLanguage } from './redux/selectors'
export { settingsApi, useGetSettingsQuery } from './services/settingsApi'
