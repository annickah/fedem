import type { SiteSettings } from './siteContent';

export type InquiryStatus = 'new' | 'in_progress' | 'processed';
export type InquiryType = 'message' | 'membership';

export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  responseText: string;
  responseSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  memberCount: number;
  membershipRequests: number;
  publishedArticles: number;
  pendingMessages: number;
  totalInquiries: number;
}

export interface AdminPayload {
  metrics: DashboardMetrics;
  inquiries: Inquiry[];
  settings: SiteSettings;
}