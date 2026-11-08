import { lazyPage as page } from '@/app/routes/lazyPage'

export const componentWorkbenchPages = {
  // Catalogue & Overview
  'overview:module-overview': page(() => import('../catalogue/OverviewPage')),
  'overview:component-catalog': page(() => import('../catalogue/ComponentCatalogPage')),
  'overview:getting-started': page(() => import('../catalogue/OverviewPage')),

  // Actions (Dedicated Submenus)
  'actions:buttons': page(() => import('../actions/ButtonsActionPage')),
  'actions:icon-buttons': page(() => import('../actions/IconButtonsActionPage')),
  'actions:table-row-actions': page(() => import('../actions/TableRowActionsShowcasePage')),
  'actions:button-groups': page(() => import('../actions/ButtonGroupsActionPage')),
  'actions:legacy-buttons': page(() => import('../actions/LegacyButtonsShowcasePage')),
  'actions:action-states': page(() => import('../docs/ActionsDocs')),

  // Forms (Dedicated 6 Form Submenus matching Probity Client exactly)
  'forms:text-inputs': page(() => import('../forms/TextInputsFormPage')),
  'forms:select-controls': page(() => import('../forms/SelectControlsFormPage')),
  'forms:checkboxes': page(() => import('../forms/CheckboxesFormPage')),
  'forms:radio-buttons': page(() => import('../forms/RadioButtonsFormPage')),
  'forms:switches': page(() => import('../forms/SwitchesFormPage')),
  'forms:date-time': page(() => import('../forms/DateTimeFormPage')),
  'forms:form-layout': page(() => import('../forms/FormLayoutShowcasePage')),
  'forms:form-validation': page(() => import('../forms/FormValidationPage')),

  // Feedback (Dedicated Submenus)
  'feedback:alerts': page(() => import('../feedback/AlertsFeedbackPage')),
  'feedback:notifications': page(() => import('../feedback/NotificationsFeedbackPage')),
  'feedback:modals-gallery': page(() => import('../feedback/ModalsGalleryPage')),
  'feedback:dialogs': page(() => import('../feedback/ModalsGalleryPage')),
  'feedback:loading-states': page(() => import('../feedback/LoadingStatesFeedbackPage')),
  'feedback:empty-states': page(() => import('../feedback/EmptyStatesFeedbackPage')),
  'feedback:tooltips': page(() => import('../feedback/TooltipsFeedbackPage')),

  // Data Display (Dedicated Submenus)
  'data-display:cards': page(() => import('../data-display/CardsDisplayPage')),
  'data-display:badges': page(() => import('../data-display/BadgesDisplayPage')),
  'data-display:tables': page(() => import('../data-display/TablesDisplayPage')),
  'data-display:pagination': page(() => import('../data-display/PaginationDisplayPage')),
  'data-display:report-overview': page(() => import('../data-display/ReportOverviewDemoPage')),

  // Navigation (Dedicated Submenus)
  'navigation:breadcrumbs': page(() => import('../navigation/BreadcrumbsNavPage')),
  'navigation:tabs': page(() => import('../navigation/TabsNavPage')),
  'navigation:dropdown-menus': page(() => import('../navigation/DropdownMenusNavPage')),
  'patterns:overview': page(() => import('../patterns/PatternsOverviewPage')),
  'patterns:domain-crud': page(() => import('../patterns/DomainCrudPatternPage')),
  'patterns:upload-import': page(() => import('../patterns/UploadModalDemoPage')),
  'patterns:workflow-ui': page(() => import('../workflow/WorkflowComponentsPage')),
  'navigation:page-layout': page(() => import('../navigation/LayoutPageComponentsPage')),
  'navigation:app-chrome': page(() => import('../navigation/AppChromeShowcasePage')),
  'navigation:headers': page(() => import('../docs/NavigationDocs')),
  'navigation:sidebars': page(() => import('../docs/NavigationDocs')),
  'navigation:grid-layout': page(() => import('../docs/NavigationDocs')),

  // Guidelines
  'guidelines:component-usage': page(() => import('../catalogue/GuidelinesExplorerPage')),
  'guidelines:accessibility': page(() => import('../catalogue/GuidelinesExplorerPage')),
  'guidelines:responsive-behavior': page(() => import('../catalogue/GuidelinesExplorerPage')),

  // Foundations Specs & Docs
  'lib-foundations:tokens': page(() => import('../docs/FoundationsDocs')),
  'lib-foundations:typography': page(() => import('../docs/FoundationsDocs')),
  'lib-foundations:spacing': page(() => import('../docs/FoundationsDocs')),
  'lib-foundations:radius-shadows': page(() => import('../docs/FoundationsDocs')),
  'lib-foundations:breakpoints': page(() => import('../docs/FoundationsDocs')),
  'lib-foundations:icons': page(() => import('../docs/FoundationsDocs')),

  // Actions Specs & Docs
  'lib-actions:buttons': page(() => import('../docs/ActionsDocs')),
  'lib-actions:icon-buttons': page(() => import('../docs/ActionsDocs')),
  'lib-actions:button-groups': page(() => import('../docs/ActionsDocs')),
  'lib-actions:action-states': page(() => import('../docs/ActionsDocs')),

  // Forms Specs & Docs (with deep links to interactive implementations)
  'lib-forms:text-input': page(() => import('../forms/TextInputsFormPage')),
  'lib-forms:password-input': page(() => import('../forms/TextInputsFormPage')),
  'lib-forms:textarea': page(() => import('../forms/TextInputsFormPage')),
  'lib-forms:select': page(() => import('../forms/SelectControlsFormPage')),
  'lib-forms:checkbox-radio': page(() => import('../forms/CheckboxesFormPage')),
  'lib-forms:switch': page(() => import('../forms/SwitchesFormPage')),
  'lib-forms:date-input': page(() => import('../forms/DateTimeFormPage')),
  'lib-forms:form-layout': page(() => import('../forms/FormLayoutShowcasePage')),
  'lib-forms:validation': page(() => import('../forms/FormValidationPage')),

  // Feedback Specs & Docs
  'lib-feedback:alerts': page(() => import('../docs/FeedbackDocs')),
  'lib-feedback:toasts': page(() => import('../docs/FeedbackDocs')),
  'lib-feedback:modals-gallery': page(() => import('../feedback/ModalsGalleryPage')),
  'lib-feedback:dialogs-modals': page(() => import('../feedback/ModalsGalleryPage')),
  'lib-feedback:tooltips': page(() => import('../docs/FeedbackDocs')),
  'lib-feedback:loading-states': page(() => import('../feedback/LoadingStatesFeedbackPage')),
  'lib-feedback:empty-states': page(() => import('../docs/FeedbackDocs')),

  // Data Display Specs & Docs
  'lib-data-display:cards': page(() => import('../docs/DataDisplayDocs')),
  'lib-data-display:badges-status': page(() => import('../docs/DataDisplayDocs')),
  'lib-data-display:tables': page(() => import('../docs/DataDisplayDocs')),
  'lib-data-display:pagination': page(() => import('../docs/DataDisplayDocs')),
  'lib-data-display:accordions-tabs': page(() => import('../docs/DataDisplayDocs')),
  'lib-data-display:report-overview': page(() => import('../data-display/ReportOverviewDemoPage')),

  // Navigation & Layout Specs & Docs
  'lib-navigation:headers': page(() => import('../docs/NavigationDocs')),
  'lib-navigation:sidebars': page(() => import('../docs/NavigationDocs')),
  'lib-navigation:dropdowns': page(() => import('../docs/NavigationDocs')),
  'lib-navigation:breadcrumbs': page(() => import('../docs/NavigationDocs')),
  'lib-navigation:grid-layout': page(() => import('../docs/NavigationDocs')),

  // Accessibility Standards & WCAG 2.2 AA Docs
  'lib-accessibility:wcag-standards': page(() => import('../docs/AccessibilityDocs')),
  'lib-accessibility:keyboard-nav': page(() => import('../docs/AccessibilityDocs')),
  'lib-accessibility:focus-management': page(() => import('../docs/AccessibilityDocs')),
  'lib-accessibility:screen-readers': page(() => import('../docs/AccessibilityDocs')),

  // Playgrounds
  'lib-playgrounds:btn-playground': page(() => import('../docs/PlaygroundsPage')),
  'lib-playgrounds:form-playground': page(() => import('../docs/PlaygroundsPage')),
  'lib-playgrounds:dialog-playground': page(() => import('../docs/PlaygroundsPage')),
  'lib-playgrounds:table-playground': page(() => import('../docs/PlaygroundsPage')),
}

export const componentExplorerPages = componentWorkbenchPages
export const uiComponentLibraryPages = componentWorkbenchPages
