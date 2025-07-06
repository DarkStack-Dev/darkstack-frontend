// lib/utils/constants.ts
export const PROJECT_CONSTANTS = {
  MAX_PROJECTS_PER_USER: 5,
  MIN_IMAGES_REQUIRED: 1,
  MAX_IMAGES_ALLOWED: 5,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  PROJECT_NAME_MAX_LENGTH: 255,
  PROJECT_DESCRIPTION_MAX_LENGTH: 5000,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
} as const;

export const PROJECT_STATUS_LABELS = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado', 
  REJECTED: 'Rejeitado',
  ARCHIVED: 'Arquivado'
} as const;

export const PROJECT_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
} as const;