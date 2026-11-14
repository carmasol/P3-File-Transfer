import { request, requestBlob } from './client'
import {
  MOCK,
  mockDeleteFile,
  mockDownload,
  mockListFiles,
  mockShareInfo,
  mockUpload,
} from './mock'
import type { ShareFile, ShareInfo, UploadResult } from './types'

export async function uploadFile(
  userId: string | null,
  file: File,
  options: { password?: string; expiresInDays: number },
): Promise<UploadResult> {
  if (MOCK) {
    return mockUpload(userId, file, options)
  }
  const form = new FormData()
  form.append('file', file)
  if (options.password) {
    form.append('password', options.password)
  }
  form.append('expiresInDays', String(options.expiresInDays))
  const data = await request<UploadResult>('/files', { method: 'POST', body: form })
  return { ...data, shareUrl: `${window.location.origin}/share/${data.shareToken}` }
}

export async function listFiles(userId: string | null): Promise<ShareFile[]> {
  if (MOCK) {
    return mockListFiles(userId)
  }
  return request<ShareFile[]>('/files/mine')
}

export async function deleteFile(userId: string | null, fileId: string): Promise<void> {
  if (MOCK) {
    return mockDeleteFile(userId, fileId)
  }
  await request<void>(`/files/${fileId}`, { method: 'DELETE' })
}

export async function getShareInfo(shareToken: string): Promise<ShareInfo> {
  if (MOCK) {
    return mockShareInfo(shareToken)
  }
  return request<ShareInfo>(`/files/share/${shareToken}`)
}

export async function downloadSharedFile(
  shareToken: string,
  password?: string,
): Promise<Blob> {
  if (MOCK) {
    return mockDownload(shareToken, password)
  }
  return requestBlob(`/files/share/${shareToken}/download`, {
    method: 'POST',
    ...(password ? { headers: { 'X-File-Password': password } } : {}),
  })
}
