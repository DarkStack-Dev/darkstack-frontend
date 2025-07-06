// lib/schemas/projectSchemas.ts
import { z } from 'zod';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'] as const;

export const projectImageSchema = z.object({
  filename: z.string().min(1, 'Nome do arquivo é obrigatório'),
  type: z.enum(ACCEPTED_IMAGE_TYPES, {
    errorMap: () => ({ message: 'Tipo de arquivo não suportado' })
  }),
  base64: z.string().min(1, 'Imagem é obrigatória'),
  isMain: z.boolean().default(false),
  size: z.number().max(MAX_FILE_SIZE, 'Arquivo muito grande (máx 10MB)').optional()
});

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo (máx 100 caracteres)'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição muito longa (máx 1000 caracteres)'),
  images: z.array(projectImageSchema)
    .min(1, 'Pelo menos 1 imagem é obrigatória')
    .max(5, 'Máximo 5 imagens permitidas')
    .refine(
      (images) => images.filter(img => img.isMain).length === 1,
      'Exatamente 1 imagem deve ser marcada como principal'
    )
});

export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type ProjectImageData = z.infer<typeof projectImageSchema>;

// Schemas para filtros
export const projectFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED']).optional(),
  ownerId: z.string().optional(),
  includeDeleted: z.boolean().default(false)
});

export type ProjectFilters = z.infer<typeof projectFiltersSchema>;