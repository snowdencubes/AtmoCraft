import { z } from 'zod';

export const resourceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['course', 'lecture_notes', 'tool', 'article', 'book', 'video', 'dataset', 'document']),
  title: z.string().min(1),
  provider: z.string().min(1),
  provider_domain: z.string().min(1),
  domain_type: z.string(),
  subject: z.string().min(1),
  sub_topics: z.array(z.string()),
  level: z.string().nullable(),
  language: z.array(z.string()),
  duration: z.string().nullable(),
  format: z.string(),
  cost: z.string(),
  access: z.string(),
  url: z.string().url(),
  direct_file_url: z.string().url().nullable(),
  file_type: z.string().nullable(),
  file_size: z.string().nullable(),
  summary: z.string(),
  modules: z.array(z.string()),
  prerequisites: z.string().nullable(),
  certificate_offered: z.enum(['yes', 'no', 'unknown']),
  license_name: z.string().nullable(),
  license_url: z.string().nullable(),
  license_evidence: z.string().nullable().optional(),
  redistribution_allowed: z.enum(['yes', 'no', 'unknown']),
  attribution_text: z.string().nullable(),
  embeddable: z.enum(['yes', 'no', 'unknown']),
  date_published_or_updated: z.string().nullable(),
  verified_date: z.string(),
  verified_by_opening_page: z.boolean(),
  confidence: z.enum(['high', 'medium', 'low', 'unknown']).optional(),
  notes: z.string().nullable()
});

export type ResourceInput = z.infer<typeof resourceSchema>;
