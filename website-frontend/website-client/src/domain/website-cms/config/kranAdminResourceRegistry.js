/** CMS admin screen config: API fields, table columns, and form fields per legacy menu primary id. */

const ACTIVE_FIELD = {
  id: 'activeStatus',
  label: 'Active',
  type: 'active',
  defaultValue: 'Y',
}

/** @typedef {{ id: string, label: string, type?: string, required?: boolean, defaultValue?: string, minWidth?: number }} ResourceField */

/** @type {Record<string, { titleField: string, columns: ResourceField[], fields: ResourceField[] }>} */
export const KRAN_ADMIN_RESOURCE_REGISTRY = {
  'website-category-setup': {
    titleField: 'name',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'name', label: 'Name', minWidth: 160 },
      { id: 'type', label: 'Type', minWidth: 100 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'name', label: 'Name', required: true },
      { id: 'type', label: 'Type' },
      ACTIVE_FIELD,
    ],
  },
  'website-products': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'name', label: 'Name', minWidth: 140 },
      { id: 'title', label: 'Title', minWidth: 160 },
      { id: 'type', label: 'Type', minWidth: 90 },
      { id: 'category', label: 'Category', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'name', label: 'Name' },
      { id: 'title', label: 'Title', required: true },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'type', label: 'Type' },
      { id: 'logo', label: 'Logo', type: 'image' },
      { id: 'category', label: 'Category' },
      { id: 'orderNo', label: 'Order', type: 'number' },
      ACTIVE_FIELD,
    ],
  },
  'website-solutions': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 180 },
      { id: 'category', label: 'Category', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'category', label: 'Category' },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      ACTIVE_FIELD,
    ],
  },
  'website-projects': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 180 },
      { id: 'client', label: 'Client', minWidth: 120 },
      { id: 'department', label: 'Department', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'category', label: 'Category' },
      { id: 'client', label: 'Client' },
      { id: 'department', label: 'Department' },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      ACTIVE_FIELD,
    ],
  },
  'website-case-study': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 180 },
      { id: 'category', label: 'Category', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'category', label: 'Category' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      { id: 'link', label: 'Link' },
      { id: 'attachmentPath', label: 'Document', type: 'document' },
      ACTIVE_FIELD,
    ],
  },
  'website-kran-seniors': {
    titleField: 'name',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'name', label: 'Name', minWidth: 140 },
      { id: 'designation', label: 'Designation', minWidth: 140 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'name', label: 'Name', required: true },
      { id: 'designation', label: 'Designation' },
      { id: 'position', label: 'Position' },
      { id: 'experience', label: 'Experience' },
      { id: 'quotes', label: 'Quotes', type: 'textarea' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      ACTIVE_FIELD,
    ],
  },
  'website-kran-faces': {
    titleField: 'name',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'name', label: 'Name', minWidth: 140 },
      { id: 'title', label: 'Title', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'name', label: 'Name', required: true },
      { id: 'title', label: 'Title' },
      { id: 'status', label: 'Status' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      ACTIVE_FIELD,
    ],
  },
  'website-data-sheets': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 200 },
      { id: 'category', label: 'Category', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'category', label: 'Category' },
      { id: 'imagePath', label: 'Image', type: 'image' },
      { id: 'link', label: 'Link' },
      { id: 'attachmentPath', label: 'Document', type: 'document' },
      ACTIVE_FIELD,
    ],
  },
  'website-timeline': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 160 },
      { id: 'heading', label: 'Heading', minWidth: 140 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'heading', label: 'Heading' },
      { id: 'description', label: 'Description', type: 'textarea' },
      ACTIVE_FIELD,
    ],
  },
  'website-gallery': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 160 },
      { id: 'groupId', label: 'Group', minWidth: 90 },
      { id: 'type', label: 'Type', minWidth: 90 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'groupId', label: 'Group ID', type: 'number', required: true },
      { id: 'imagePath', label: 'Image', type: 'image' },
      { id: 'type', label: 'Type' },
    ],
  },
  'website-careers': {
    titleField: 'title',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'title', label: 'Title', minWidth: 180 },
      { id: 'location', label: 'Location', minWidth: 120 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'title', label: 'Title', required: true },
      { id: 'jobDescription', label: 'Description', type: 'textarea' },
      { id: 'skillSet', label: 'Skills' },
      { id: 'location', label: 'Location' },
      { id: 'experience', label: 'Experience' },
      ACTIVE_FIELD,
    ],
  },
  'website-mail-setup': {
    titleField: 'type',
    columns: [
      { id: 'id', label: 'ID', minWidth: 72 },
      { id: 'type', label: 'Type', minWidth: 100 },
      { id: 'mailTo', label: 'Mail to', minWidth: 200 },
      { id: 'activeStatus', label: 'Active', minWidth: 72 },
    ],
    fields: [
      { id: 'type', label: 'Type', required: true },
      { id: 'mailTo', label: 'Mail to' },
      { id: 'mailCc', label: 'Mail CC' },
      ACTIVE_FIELD,
    ],
  },
}

export function getKranAdminResourceConfig(primaryId) {
  return KRAN_ADMIN_RESOURCE_REGISTRY[primaryId] ?? null
}